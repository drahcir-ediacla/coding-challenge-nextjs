import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { webhookUrl, message } = body;

  if (!webhookUrl || !message) {
    return NextResponse.json({ error: 'Missing webhookUrl or message' }, { status: 400 });
  }

  try {
    const slackRes = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });

    if (!slackRes.ok) {
      const errorText = await slackRes.text();
      return NextResponse.json({ error: errorText }, { status: slackRes.status });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ err: 'Internal Server Error' }, { status: 500 });
  }
}
