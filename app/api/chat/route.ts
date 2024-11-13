import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { provider, apiKey, messages } = await req.json();

  try {
    let response;

    if (provider === 'openai') {
      const openai = new OpenAI({ apiKey });
      const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages,
      });
      response = completion.choices[0].message.content;
    } else {
      const anthropic = new Anthropic({ apiKey });
      const completion = await anthropic.messages.create({
        model: 'claude-3-sonnet-20240229',
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      });
      response = completion.content[0].text;
    }

    return NextResponse.json({ response });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 });
  }
} 