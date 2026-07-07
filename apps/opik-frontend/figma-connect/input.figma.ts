// url=https://www.figma.com/design/DQkbgEBm59YiQUzoxxZ0ON/Opik-Design-System?node-id=7-3826
// source=apps/opik-frontend/src/ui/input.tsx
// component=Input
import figma from "figma";

const instance = figma.selectedInstance;

const dimension = instance.getEnum("Size", {
  Medium: "sm",
  Small: "xs",
});
const disabled = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Focus: false,
  Filled: false,
  Disabled: true,
  Error: false,
});
const hasLabel = instance.getBoolean("Label");

let labelText;
if (hasLabel) {
  const texts = instance.findLayers((n) => n.type === "TEXT", {
    traverseInstances: true,
  });
  labelText = texts[0] ? texts[0].textContent : "Label";
}

export default {
  example: hasLabel
    ? figma.code`<div className="flex flex-col gap-1">
  <Label>${labelText}</Label>
  <Input dimension="${dimension}"${disabled ? " disabled" : ""} />
</div>`
    : figma.code`<Input dimension="${dimension}"${
        disabled ? " disabled" : ""
      } />`,
  imports: [
    'import { Input } from "@/ui/input"',
    'import { Label } from "@/ui/label"',
  ],
  id: "input",
  metadata: { nestable: true },
};
