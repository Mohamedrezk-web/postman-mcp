# Postman MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server that connects Claude and other MCP-compatible clients to the Postman API, enabling programmatic access to your workspaces, collections, and environments.

## Features

- List and retrieve Postman collections and their contents
- List and retrieve Postman environments and variables
- List and retrieve Postman workspaces with associated resources

## Prerequisites

- Node.js
- A [Postman API key](https://go.pstmn.io/api-docs-generate-key)

## Installation

```bash
git clone https://github.com/Mohamedrezk-web/postman-mcp.git
cd postman-mcp-server
npm install
```

## Configuration

Set your Postman API key as an environment variable:

```bash
export POSTMAN_API_KEY=your_api_key_here
```

On Windows (PowerShell):

```powershell
$env:POSTMAN_API_KEY = "your_api_key_here"
```

## Usage

Start the MCP server:

```bash
npm start
```

The server communicates over stdio and can be connected to any MCP-compatible client such as Claude Desktop.

### Claude Desktop Integration

Add the following to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "postman": {
      "command": "node",
      "args": ["/path/to/postman-mcp-server/node_modules/.bin/tsx", "/path/to/postman-mcp-server/src/server.ts"],
      "env": {
        "POSTMAN_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Available Tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `list_collections` | List all Postman collections | — |
| `get_collection` | Get full details of a collection | `collection_id` |
| `list_environments` | List all Postman environments | — |
| `get_environment` | Get all variables in an environment | `environment_id` |
| `list_workspaces` | List all Postman workspaces | — |
| `get_workspace` | Get details of a workspace | `workspace_id` |

## Tech Stack

- **TypeScript** — Language
- **[@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)** — MCP server framework
- **[Axios](https://axios-http.com)** — HTTP client for Postman API requests
- **[Zod](https://zod.dev)** — Schema validation for tool inputs

## License

MIT © 2026 Mohamedrezk-web
