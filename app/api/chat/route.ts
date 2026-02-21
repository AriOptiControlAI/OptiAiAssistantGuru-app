import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { sendMessageToN8n } from '@/lib/n8n';

// Allow up to 60 seconds for n8n AI responses
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await verifyToken(token);
  if (!user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const body = await req.json();
  const { message, sessionId } = body;

  if (!message || !sessionId) {
    return NextResponse.json(
      { error: 'Missing message or sessionId' },
      { status: 400 }
    );
  }

  try {
    const output = await sendMessageToN8n({ chatInput: message, sessionId });
    return NextResponse.json({ output });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'n8n error';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
