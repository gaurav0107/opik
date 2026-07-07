// url=https://www.figma.com/design/DQkbgEBm59YiQUzoxxZ0ON/Opik-Design-System?node-id=6-1377
// source=apps/opik-frontend/src/ui/button.tsx
// component=Button (icon sizes)
import figma from "figma";

const instance = figma.selectedInstance;

const variant = instance.getEnum("Type", {
  Primary: "default",
  Secondary: "secondary",
  Tertiary: "outline",
  Ghost: "ghost",
  Minimal: "minimal",
});
const size = instance.getEnum("Size", {
  Large: "icon",
  Medium: "icon-sm",
  Small: "icon-xs",
  XSmall: "icon-2xs",
});
const disabled = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Active: false,
  Disabled: true,
});
const badge = instance.getBoolean("Badge");

const icon = instance.getInstanceSwap("Icon");
let iconCode;
if (icon && icon.type === "INSTANCE") {
  iconCode = icon.executeTemplate().example;
}

export default {
  example: figma.code`<Button variant="${variant}" size="${size}"${
    badge ? " badge" : ""
  }${disabled ? " disabled" : ""}>${
    iconCode ? figma.code`${iconCode}` : ""
  }</Button>`,
  imports: ['import { Button } from "@/ui/button"'],
  id: "icon-button",
  metadata: { nestable: true },
};
