import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from "@modelcontextprotocol/sdk/types.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Initialize the MCP server
const server = new Server({
  name: "mcp-starter",
  version: "1.0.0",
});

// Define your tools here
// Example tool: echo input
const EchoInputSchema = z.object({
  message: z.string().describe("The message to echo back"),
});

const tools: Tool[] = [
  {
    name: "echo",
    description: "Echo back the input message",
    inputSchema: {
      type: "object",
      properties: {
        message: {
          type: "string",
          description: "The message to echo back",
        },
      },
      required: ["message"],
    },
  },
  {
    name: "get_info",
    description: "Get basic information about the MCP server",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
];

// Handle ListTools request
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle CallTool request
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request;

  if (name === "echo") {
    const parsed = EchoInputSchema.parse(args);
    return {
      content: [
        {
          type: "text",
          text: `Echo: ${parsed.message}`,
        },
      ],
    };
  }

  if (name === "get_info") {
    return {
      content: [
        {
          type: "text",
          text: "MCP Starter Server v1.0.0\nReady to expose your API or service.\nAdd more tools in src/index.ts",
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: `Unknown tool: ${name}`,
      },
    ],
    isError: true,
  };
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Starter server running on stdio");
}

main().catch(console.error);