const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL!;

export interface N8nChatPayload {
  chatInput: string;
  sessionId: string;
}

export async function sendMessageToN8n(payload: N8nChatPayload): Promise<string> {
  const res = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(60000),
  });

  if (!res.ok) {
    throw new Error(`n8n responded with status ${res.status}`);
  }

  const data = await res.json();

  // n8n Chat Trigger with responseMode: "lastNode" + AI Agent returns { output: "..." }
  return data.output || data.text || data.message || JSON.stringify(data);
}
