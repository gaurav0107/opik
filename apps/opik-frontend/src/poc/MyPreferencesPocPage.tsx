import { Brain, ExternalLink, Flag, Plug, Unplug } from "lucide-react";

import { Button } from "@/ui/button";
import { Card } from "@/ui/card";
import { Label } from "@/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";

import claudeLogo from "./assets/claude.svg";
import codexLogo from "./assets/codex.svg";

type McpServerRow = {
  name: string;
  toolCalls: string;
  tokensUsed: string;
  lastUsed: string;
  flagged: boolean;
};

const MCP_SERVERS: McpServerRow[] = [
  {
    name: "Slack",
    toolCalls: "412",
    tokensUsed: "184,000",
    lastUsed: "2 hours ago",
    flagged: false,
  },
  {
    name: "Google Drive",
    toolCalls: "96",
    tokensUsed: "51,200",
    lastUsed: "1 day ago",
    flagged: false,
  },
  {
    name: "Atlassian",
    toolCalls: "58",
    tokensUsed: "33,500",
    lastUsed: "13 days ago",
    flagged: false,
  },
  {
    name: "Sentry",
    toolCalls: "0",
    tokensUsed: "0",
    lastUsed: "Never",
    flagged: true,
  },
  {
    name: "Zoom Info",
    toolCalls: "0",
    tokensUsed: "0",
    lastUsed: "62 days ago",
    flagged: true,
  },
  {
    name: "Figma",
    toolCalls: "0",
    tokensUsed: "1,200",
    lastUsed: "41 days ago",
    flagged: true,
  },
];

type ModelField = {
  label: string;
  value: string;
};

type CodingTool = {
  name: string;
  logo: string;
  fields: ModelField[];
};

const CODING_TOOLS: CodingTool[] = [
  {
    name: "Claude Code",
    logo: claudeLogo,
    fields: [
      { label: "Default model", value: "Opus 4.8" },
      { label: "Default effort level", value: "Low" },
    ],
  },
  {
    name: "Codex",
    logo: codexLogo,
    fields: [
      { label: "Default model", value: "GPT-5.3" },
      { label: "Reasoning", value: "Low" },
    ],
  },
];

const SectionHeader = ({
  iconBackground,
  icon,
  title,
}: {
  iconBackground: string;
  icon: React.ReactNode;
  title: string;
}) => (
  <div className="flex items-center gap-1.5">
    <div
      className="flex size-4 items-center justify-center rounded-sm p-1"
      style={{ backgroundColor: iconBackground }}
    >
      {icon}
    </div>
    <Button variant="link" size="sm" className="h-6 px-0 text-foreground">
      {title}
    </Button>
  </div>
);

const ModelConfigField = ({ field }: { field: ModelField }) => (
  <div className="flex min-w-20 flex-col gap-1">
    <div className="flex items-center gap-1 px-0.5 pb-0.5">
      <Label className="comet-body-xs-accented text-foreground">
        {field.label}
      </Label>
      <Button variant="minimal" size="icon-3xs">
        <ExternalLink />
      </Button>
    </div>
    <Select value={field.value}>
      <SelectTrigger className="comet-body-xs h-8">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={field.value}>{field.value}</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

const MyPreferencesPocPage = () => {
  return (
    <div className="flex flex-col px-5">
      <div className="flex items-center pb-4 pt-3">
        <h1 className="comet-title-xs text-[#191A1C]">My preferences</h1>
      </div>
      <div className="flex flex-col gap-2">
        <Card className="flex w-full flex-col gap-3 p-3">
          <div className="flex flex-col gap-2">
            <SectionHeader
              iconBackground="#6BDF93"
              icon={<Brain className="size-3 text-white" />}
              title="Model configuration"
            />
            <p className="comet-body-xs text-foreground">
              Configure the default model and effort level for each coding tool.
            </p>
          </div>
          {CODING_TOOLS.map((tool) => (
            <div key={tool.name} className="flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <img src={tool.logo} className="size-3" alt={tool.name} />
                <span className="comet-body-xs-accented text-foreground">
                  {tool.name}
                </span>
              </div>
              <div className="w-full rounded-md border bg-soft-background p-3">
                <div className="grid grid-cols-2 gap-3">
                  {tool.fields.map((field) => (
                    <ModelConfigField key={field.label} field={field} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </Card>
        <Card className="flex w-full flex-col gap-2 p-3">
          <SectionHeader
            iconBackground="#89DEFF"
            icon={<Plug className="size-3 text-white" />}
            title="MCP servers"
          />
          <p className="comet-body-xs text-foreground">
            Usage over the last 30 days. Tools with no activity are flagged so
            you can remove them.
          </p>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">MCP server</TableHead>
                <TableHead className="w-[120px]">Tool calls</TableHead>
                <TableHead className="w-[360px]">Token used</TableHead>
                <TableHead className="w-[278px]">Last used</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {MCP_SERVERS.map((server) => (
                <TableRow key={server.name} className="h-10">
                  <TableCell>
                    <div className="flex items-center gap-1.5">
                      <span className="comet-body-xs text-foreground">
                        {server.name}
                      </span>
                      {server.flagged && (
                        <Flag className="size-4 text-[#BA7517]" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="comet-body-xs text-foreground">
                    {server.toolCalls}
                  </TableCell>
                  <TableCell className="comet-body-xs text-foreground">
                    {server.tokensUsed}
                  </TableCell>
                  <TableCell
                    className={
                      server.flagged
                        ? "comet-body-xs text-[#BA7517]"
                        : "comet-body-xs text-foreground"
                    }
                  >
                    {server.lastUsed}
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="icon-2xs">
                      <Unplug />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default MyPreferencesPocPage;
