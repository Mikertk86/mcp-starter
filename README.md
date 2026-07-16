# MCP Starter Server

A TypeScript starter template for building Model Context Protocol (MCP) servers.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Build

```bash
npm run build
```

### Run

```bash
npm run dev
```

## Architecture

- **src/index.ts** - Main server file with tool definitions
- **tsconfig.json** - TypeScript configuration
- **package.json** - Dependencies and scripts

## Adding Tools

Edit `src/index.ts` to add new tools:

1. Define a Zod schema for input validation
2. Add the tool to the `tools` array with name, description, and inputSchema
3. Handle the tool in the CallToolRequestSchema handler

Example:

```typescript
const MyToolSchema = z.object({
  param1: z.string().describe("Description"),
});

const tools: Tool[] = [
  {
    name: "my_tool",
    description: "What this tool does",
    inputSchema: {
      type: "object",
      properties: {
        param1: {
          type: "string",
          description: "Description",
        },
      },
      required: ["param1"],
    },
  },
];

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request;
  
  if (name === "my_tool") {
    const parsed = MyToolSchema.parse(args);
    return {
      content: [
        {
          type: "text",
          text: `Result: ${parsed.param1}`,
        },
      ],
    };
  }
});
```

## Testing

Use the [MCP Inspector](https://github.com/modelcontextprotocol/inspector) to test your server:

```bash
npx @modelcontextprotocol/inspector node build/index.js
```

## Next Steps

1. Add your first custom tool
2. Connect to an external API
3. Test with MCP Inspector
4. Deploy to production

## Resources

- [MCP Protocol Specification](https://modelcontextprotocol.io)
- [TypeScript SDK Documentation](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Best Practices](https://modelcontextprotocol.io/docs/best-practices)