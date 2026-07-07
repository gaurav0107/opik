// url=https://www.figma.com/design/DQkbgEBm59YiQUzoxxZ0ON/Opik-Design-System?node-id=50-957
// source=apps/opik-frontend/src/ui/table.tsx
// component=TableCell
import figma from "figma";

const instance = figma.selectedInstance;

const texts = instance.findLayers((n) => n.type === "TEXT", {
  traverseInstances: true,
});
const content = texts[0] ? texts[0].textContent : "";

export default {
  example: figma.code`<TableCell>${content}</TableCell>`,
  imports: ['import { TableCell } from "@/ui/table"'],
  id: "table-cell",
  metadata: { nestable: true },
};
