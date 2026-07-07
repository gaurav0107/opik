// url=https://www.figma.com/design/DQkbgEBm59YiQUzoxxZ0ON/Opik-Design-System?node-id=2370-129033
// source=apps/opik-frontend/src/ui/button.tsx
// component=Button
import figma from "figma";

const instance = figma.selectedInstance;

const variant = instance.getEnum("Type", {
  Primary: "default",
  Secondary: "secondary",
  Tertiary: "outline",
  Ghost: "ghost",
  Destructive: "destructive",
});
const size = instance.getEnum("Size", {
  Large: "default",
  Medium: "sm",
  Small: "xs",
  XSmall: "2xs",
});
const disabled = instance.getEnum("State", {
  Default: false,
  Hover: false,
  Active: false,
  Disabled: true,
});

const showIconLeft = instance.getBoolean("IconLeft");
const showIconRight = instance.getBoolean("IconRight");
const iconLeft = showIconLeft ? instance.getInstanceSwap("↳ IconLeft-Instance") : null;
const iconRight = showIconRight ? instance.getInstanceSwap("↳ IconRight-Instance") : null;
let iconLeftCode;
if (iconLeft && iconLeft.type === "INSTANCE") {
  iconLeftCode = iconLeft.executeTemplate().example;
}
let iconRightCode;
if (iconRight && iconRight.type === "INSTANCE") {
  iconRightCode = iconRight.executeTemplate().example;
}

const texts = instance.findLayers((n) => n.type === "TEXT");
const label = texts[0] ? texts[0].textContent : "Label";

export default {
  example: figma.code`<Button variant="${variant}" size="${size}"${disabled ? " disabled" : ""}>${iconLeftCode ? figma.code`${iconLeftCode} ` : ""}${label}${iconRightCode ? figma.code` ${iconRightCode}` : ""}</Button>`,
  imports: ['import { Button } from "@/ui/button"'],
  id: "button",
  metadata: { nestable: true },
};
