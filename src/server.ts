import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import axios from 'axios';

const apiKey = process.env.POSTMAN_API_KEY;
if (!apiKey) {
	console.error('Error: POSTMAN_API_KEY environment variable is required');
	process.exit(1);
}

const httpClient = axios.create({
	baseURL: 'https://api.getpostman.com',
	headers: { 'X-API-Key': apiKey },
});

const server = new McpServer({ name: 'postman-mcp', version: '1.0.0' });

function apiError(error: unknown): string {
	const e = error as { response?: { data?: { error?: { message?: string } } }; message?: string };
	return e?.response?.data?.error?.message ?? e?.message ?? String(error);
}

server.registerTool(
	'list_collections',
	{ description: 'List all Postman collections with their IDs and names' },
	async () => {
		try {
			const data = (await httpClient.get('/collections')).data.collections;
			return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
		} catch (error) {
			return { isError: true, content: [{ type: 'text', text: `Postman API error: ${apiError(error)}` }] };
		}
	},
);

server.registerTool(
	'get_collection',
	{
		description: 'Get full details of a collection including all requests, folders, and variables',
		inputSchema: { collection_id: z.string().describe('The collection UID (e.g. 123-abc-def)') },
	},
	async ({ collection_id }) => {
		try {
			const data = (await httpClient.get(`/collections/${collection_id}`)).data.collection;
			return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
		} catch (error) {
			return { isError: true, content: [{ type: 'text', text: `Postman API error: ${apiError(error)}` }] };
		}
	},
);

server.registerTool(
	'list_environments',
	{ description: 'List all Postman environments with their IDs and names' },
	async () => {
		try {
			const data = (await httpClient.get('/environments')).data.environments;
			return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
		} catch (error) {
			return { isError: true, content: [{ type: 'text', text: `Postman API error: ${apiError(error)}` }] };
		}
	},
);

server.registerTool(
	'get_environment',
	{
		description: 'Get all variables and values in a specific environment',
		inputSchema: { environment_id: z.string().describe('The environment UID') },
	},
	async ({ environment_id }) => {
		try {
			const data = (await httpClient.get(`/environments/${environment_id}`)).data.environment;
			return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
		} catch (error) {
			return { isError: true, content: [{ type: 'text', text: `Postman API error: ${apiError(error)}` }] };
		}
	},
);

server.registerTool(
	'list_workspaces',
	{ description: 'List all Postman workspaces' },
	async () => {
		try {
			const data = (await httpClient.get('/workspaces')).data.workspaces;
			return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
		} catch (error) {
			return { isError: true, content: [{ type: 'text', text: `Postman API error: ${apiError(error)}` }] };
		}
	},
);

server.registerTool(
	'get_workspace',
	{
		description: 'Get details of a specific workspace including its collections and environments',
		inputSchema: { workspace_id: z.string().describe('The workspace ID') },
	},
	async ({ workspace_id }) => {
		try {
			const data = (await httpClient.get(`/workspaces/${workspace_id}`)).data.workspace;
			return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
		} catch (error) {
			return { isError: true, content: [{ type: 'text', text: `Postman API error: ${apiError(error)}` }] };
		}
	},
);

const transport = new StdioServerTransport();
await server.connect(transport);
