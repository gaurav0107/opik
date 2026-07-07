import StyleDictionary from "style-dictionary";

const HEADER = `/**
 * AUTO-GENERATED — DO NOT EDIT.
 * Source: Figma "Opik Design System" styles, exported to design-tokens/tokens.json (DTCG).
 * Rebuild with: npm run tokens:build
 *
 * PoC (OPIK-7260): this file is NOT imported into the build. It exists to be
 * reconciled against the hand-maintained tokens in src/main.scss.
 */`;

StyleDictionary.registerFormat({
  name: "css/variables-with-notice",
  format: async ({ dictionary }) => {
    const lines = dictionary.allTokens.map(
      (token) => `  --${token.name}: ${token.$value ?? token.value};`,
    );
    return `${HEADER}\n\n:root {\n${lines.join("\n")}\n}\n`;
  },
});

export default {
  source: ["design-tokens/tokens.json"],
  platforms: {
    css: {
      transformGroup: "css",
      transforms: ["name/kebab", "typography/css/shorthand", "shadow/css/shorthand"],
      buildPath: "src/styles/",
      files: [
        {
          destination: "tokens.generated.css",
          format: "css/variables-with-notice",
        },
      ],
    },
  },
};
