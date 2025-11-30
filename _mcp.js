// _mcp.js
import http from "node:http";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

import "./bootstrap/app.js"; // mantém se você precisa disso pro resto da app

async function main() {
    // ===== 1) Cria o servidor MCP =====
    const server = new McpServer({
        name: "devweb-mcp-http",
        version: "1.0.0",
    });

    // ===== 2) Tool básica embutida (ping) =====
    server.registerTool(
        "ping",
        {
            title: "Ping",
            description: "Tool de teste que responde pong.",
            inputSchema: {
                type: "object",
                properties: {
                    msg: { type: "string" }
                },
                required: [],
                additionalProperties: false
            }
        },
        async (args, ctx) => {
            const msg = args?.msg ?? "ok";
            return {
                content: [
                    {
                        type: "text",
                        text: `pong: ${msg}`
                    }
                ]
            };
        }
    );

    // ===== 3) Transport HTTP MCP =====
    const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined // stateless
    });

    await server.connect(transport);

    const PORT = process.env.MCP_PORT ? Number(process.env.MCP_PORT) : 7777;

    // ===== 4) HTTP server na raiz / =====
    const httpServer = http.createServer((req, res) => {
        // Health check simples (pra testar via curl)
        if (req.method === "GET" && req.url === "/health") {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ ok: true, mcp: "devweb-mcp-http" }));
            return;
        }

        // Endpoint MCP: POST /
        if (req.url === "/" && req.method === "POST") {
            let body = "";

            req.on("data", (chunk) => {
                body += chunk;
            });

            req.on("end", async () => {
                let json = undefined;

                if (body && body.trim() !== "") {
                    try {
                        json = JSON.parse(body);
                    } catch (e) {
                        console.error("[MCP] JSON inválido recebido:", e);
                        res.statusCode = 400;
                        res.setHeader("Content-Type", "application/json");
                        res.end(
                            JSON.stringify({
                                jsonrpc: "2.0",
                                error: {
                                    code: -32700,
                                    message: "Invalid JSON"
                                },
                                id: null
                            })
                        );
                        return;
                    }
                }

                try {
                    await transport.handleRequest(req, res, json);
                } catch (error) {
                    console.error("[MCP] Erro ao tratar request MCP:", error);
                    if (!res.headersSent) {
                        res.statusCode = 500;
                        res.setHeader("Content-Type", "application/json");
                        res.end(
                            JSON.stringify({
                                jsonrpc: "2.0",
                                error: {
                                    code: -32603,
                                    message: "Internal server error"
                                },
                                id: json?.id ?? null
                            })
                        );
                    }
                }
            });

            req.on("error", (err) => {
                console.error("[MCP] Erro no stream de request:", err);
                if (!res.headersSent) {
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(
                        JSON.stringify({
                            jsonrpc: "2.0",
                            error: {
                                code: -32602,
                                message: "Request stream error"
                            },
                            id: null
                        })
                    );
                }
            });

            return;
        }

        // Qualquer outra coisa -> 404 em JSON (nada de HTML)
        res.statusCode = 404;
        res.setHeader("Content-Type", "application/json");
        res.end(
            JSON.stringify({
                jsonrpc: "2.0",
                error: {
                    code: -32601,
                    message: "Not found"
                },
                id: null
            })
        );
    });

    httpServer.listen(PORT, () => {
        console.log(`[MCP] Servidor MCP HTTP em http://127.0.0.1:${PORT}`);
    });

    httpServer.on("error", (err) => {
        console.error("[MCP] Erro ao subir HTTP:", err);
        process.exit(1);
    });
}

main().catch((err) => {
    console.error("[MCP] Erro fatal:", err);
    process.exit(1);
});
