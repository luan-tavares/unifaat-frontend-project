// app/Tools/broadcastMessage.js

import FirstJob from "../Jobs/FirstJob.js";

/**
 * Registra a tool broadcastMessage no MCP server.
 *
 * Args esperados:
 * {
 *   "name": "lululu",        // opcional
 *   "text": "oi, sou uma ia" // obrigatório
 * }
 */
export function broadcastMessage(server) {
    server.registerTool(
        "broadcastMessage",
        {
            title: "Broadcast message",
            description: "Envia uma mensagem para todos os clientes conectados.",
            inputSchema: {
                type: "object",
                properties: {
                    name: { type: "string" },
                    text: { type: "string" },
                },
                required: ["text"],          // só o texto é obrigatório
                additionalProperties: false, // evita lixo no payload
            },
        },
        async (args, ctx) => {
            // garante que sempre existe algum name (nem que seja "anonymous")
            const { name = "anonymous", text } = args;

            // dispara o job para mandar via socket
            await FirstJob.dispatchSocket({
                type: "message",
                name,
                text,
            });

            // resposta MCP no formato esperado
            return {
                content: [
                    {
                        type: "text",
                        text: `Mensagem enviada para "${name}": ${text}`,
                    },
                ],
            };
        }
    );
}
