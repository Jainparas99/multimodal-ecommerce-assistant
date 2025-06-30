import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  const formData = await req.formData();
  const userMessage = formData.get('message');
  const imageFile = formData.get('image') as File | null;

  if (!userMessage) {
    return NextResponse.json({ error: 'No user message provided' }, { status: 400 });
  }

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'user',
      content: [
        { type: 'text', text: userMessage.toString() },
      ] as OpenAI.Chat.Completions.ChatCompletionContentPart[],
    },
  ];

  if (imageFile) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = buffer.toString('base64');

    (messages[0].content as OpenAI.Chat.Completions.ChatCompletionContentPart[]).push({
      type: 'image_url',
      image_url: {
        url: `data:${imageFile.type};base64,${base64Image}`,
      },
    });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini', 
      messages,
    });

    const assistantReply = completion.choices[0].message.content;
    return NextResponse.json({ reply: assistantReply });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return NextResponse.json({ error: 'OpenAI API request failed' }, { status: 500 });
  }
}