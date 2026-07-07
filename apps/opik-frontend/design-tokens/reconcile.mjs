import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const scss = fs.readFileSync(path.join(root, "src/main.scss"), "utf8");
const tokens = JSON.parse(
  fs.readFileSync(path.join(root, "design-tokens/tokens.json"), "utf8"),
);

// Figma style path -> main.scss custom property it should correspond to.
const FIGMA_TO_CODE = {
  "comet.black": null,
  "comet.white": "--white",
  "comet.foreground": "--foreground",
  "tailwind.border": "--border",
  "tailwind.light-slate": "--light-slate",
  "tailwind.muted-slate": "--muted-slate",
  "tailwind.soft-background": "--soft-background",
  "tailwind.primary-foreground": "--primary-foreground",
  "tailwind.disabled": "--muted-disabled",
  "tailwind.foreground-secondary": "--foreground-secondary",
  "charts.purple-dark": "--tag-purple-text",
  "charts.purple-light": "--tag-purple-bg",
  "charts.green-dark": "--tag-green-text",
  "charts.green-light": "--tag-green-bg",
};

// Styles that exist in the Figma library but whose values could not be
// exported via the MCP in the PoC (need REST styles export with a PAT).
const UNRESOLVED_FIGMA_STYLES = {
  "Comet/Warning": "--warning",
  "Comet/Success": "--success",
  "Comet/Click Blue": "--click-blue",
  "Comet/Primary Blue": "--primary",
  "Comet/Hover  Blue": "--primary-hover",
  "Comet/Secondary Blue": "--secondary",
  "Tailwind/slate-300": "--slate-300",
  "Tailwind/muted-gray": "--muted-gray",
};

function parseRootBlock(source) {
  const start = source.indexOf(":root");
  const open = source.indexOf("{", start);
  let depth = 1;
  let i = open + 1;
  while (depth > 0 && i < source.length) {
    if (source[i] === "{") depth++;
    if (source[i] === "}") depth--;
    i++;
  }
  const block = source.slice(open + 1, i - 1);
  const vars = {};
  for (const match of block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    vars[match[1]] = match[2].trim();
  }
  return vars;
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  if (value.length < 6) return null;
  return [0, 2, 4].map((offset) =>
    parseInt(value.slice(offset, offset + 2), 16),
  );
}

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const hp = h / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const m = l - c / 2;
  const sector = Math.floor(hp) % 6;
  const rgb = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][sector];
  return rgb.map((channel) => Math.round((channel + m) * 255));
}

function cssValueToRgb(value) {
  if (value.startsWith("#")) return hexToRgb(value);
  const hslTriple = value.match(/^([\d.]+)[,\s]+([\d.]+)%[,\s]+([\d.]+)%$/);
  if (hslTriple) {
    return hslToRgb(
      parseFloat(hslTriple[1]),
      parseFloat(hslTriple[2]),
      parseFloat(hslTriple[3]),
    );
  }
  return null;
}

function flattenColors(node, prefix = []) {
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (value && typeof value === "object" && "$value" in value) {
      if (value.$type === "color")
        out[[...prefix, key].join(".")] = value.$value;
    } else if (value && typeof value === "object") {
      Object.assign(out, flattenColors(value, [...prefix, key]));
    }
  }
  return out;
}

const codeVars = parseRootBlock(scss);
const figmaColors = flattenColors(tokens);

const rows = { match: [], mismatch: [], missingInCode: [] };

for (const [figmaPath, figmaValue] of Object.entries(figmaColors)) {
  const codeVar = FIGMA_TO_CODE[figmaPath];
  if (codeVar === null || !(codeVar in (codeVar ? codeVars : {}))) {
    if (codeVar === null || !(codeVar in codeVars)) {
      rows.missingInCode.push({ figmaPath, figmaValue, codeVar });
      continue;
    }
  }
  const figmaRgb = hexToRgb(figmaValue);
  const codeRgb = cssValueToRgb(codeVars[codeVar]);
  if (!figmaRgb || !codeRgb) {
    rows.mismatch.push({
      figmaPath,
      figmaValue,
      codeVar,
      codeValue: codeVars[codeVar],
      note: "unparsed",
    });
    continue;
  }
  const delta = Math.max(
    ...figmaRgb.map((channel, index) => Math.abs(channel - codeRgb[index])),
  );
  const entry = {
    figmaPath,
    figmaValue,
    codeVar,
    codeValue: codeVars[codeVar],
    delta,
  };
  if (delta <= 2) rows.match.push(entry);
  else rows.mismatch.push(entry);
}

const mappedCodeVars = new Set(
  [
    ...Object.values(FIGMA_TO_CODE),
    ...Object.values(UNRESOLVED_FIGMA_STYLES),
  ].filter(Boolean),
);
const unmappedCodeVars = Object.keys(codeVars).filter(
  (name) => !mappedCodeVars.has(name),
);

const lines = [];
lines.push("# Token reconciliation: Figma styles vs src/main.scss (:root)");
lines.push("");
lines.push(`- Figma color tokens exported: ${Object.keys(figmaColors).length}`);
lines.push(
  `- main.scss :root custom properties: ${Object.keys(codeVars).length}`,
);
lines.push("");
lines.push(`## Matches (channel delta <= 2): ${rows.match.length}`);
for (const row of rows.match) {
  lines.push(
    `- ${row.figmaPath} ${row.figmaValue} == ${row.codeVar}: ${row.codeValue} (delta ${row.delta})`,
  );
}
lines.push("");
lines.push(`## Mismatches: ${rows.mismatch.length}`);
for (const row of rows.mismatch) {
  lines.push(
    `- ${row.figmaPath} ${row.figmaValue} != ${row.codeVar}: ${row.codeValue}${
      row.delta !== undefined ? ` (delta ${row.delta})` : ""
    }${row.note ? ` [${row.note}]` : ""}`,
  );
}
lines.push("");
lines.push(`## In Figma but missing in code: ${rows.missingInCode.length}`);
for (const row of rows.missingInCode) {
  lines.push(`- ${row.figmaPath} ${row.figmaValue}`);
}
lines.push("");
lines.push(
  `## Figma styles identified but value not exported (MCP limit; need REST export): ${
    Object.keys(UNRESOLVED_FIGMA_STYLES).length
  }`,
);
for (const [styleName, codeVar] of Object.entries(UNRESOLVED_FIGMA_STYLES)) {
  lines.push(
    `- ${styleName} -> expected counterpart ${codeVar}: ${
      codeVars[codeVar] ?? "(no code var)"
    }`,
  );
}
lines.push("");
lines.push(
  `## In code but not in Figma export (out of PoC scope): ${unmappedCodeVars.length}`,
);
lines.push(unmappedCodeVars.join(", "));
lines.push("");

process.stdout.write(lines.join("\n"));
