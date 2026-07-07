// url=https://www.figma.com/design/DQkbgEBm59YiQUzoxxZ0ON/Opik-Design-System?node-id=3297-7035
// source=apps/opik-frontend/src/ui/tag.tsx
// component=Tag
import figma from "figma";

const instance = figma.selectedInstance;

const variant = instance.getEnum("Color", {
  Purple: "purple",
  Burgundy: "burgundy",
  Pink: "pink",
  Red: "red",
  Orange: "orange",
  Yellow: "yellow",
  Green: "green",
  Turquoise: "turquoise",
  Blue: "blue",
  Gray: "gray",
  Custom: "default",
  LightGray: "default",
});

const showIconLeft = instance.getBoolean("ShowIconLeft");
const showIconRight = instance.getBoolean("ShowIconRight");
const iconLeft = showIconLeft ? instance.getInstanceSwap("↳ IconLeft") : null;
const iconRight = showIconRight ? instance.getInstanceSwap("↳ IconRight") : null;
let iconLeftCode;
if (iconLeft && iconLeft.type === "INSTANCE") {
  iconLeftCode = iconLeft.executeTemplate().example;
}
let iconRightCode;
if (iconRight && iconRight.type === "INSTANCE") {
  iconRightCode = iconRight.executeTemplate().example;
}

const texts = instance.findLayers((n) => n.type === "TEXT");
const label = texts[0] ? texts[0].textContent : "Tag";

export default {
  example: figma.code`<Tag variant="${variant}">${iconLeftCode ? figma.code`${iconLeftCode} ` : ""}${label}${iconRightCode ? figma.code` ${iconRightCode}` : ""}</Tag>`,
  imports: ['import { Tag } from "@/ui/tag"'],
  id: "tag",
  metadata: { nestable: true },
};
