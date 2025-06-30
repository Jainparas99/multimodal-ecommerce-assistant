import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const formData = await req.formData();
  const message = formData.get('message');
  const imageFile = formData.get('image') as File | null;

  console.log('Received message:', message);
  console.log('Received image:', imageFile?.name);

  return NextResponse.json({
    reply: `You said: ${message}, and uploaded image: ${imageFile?.name ?? 'None'}`
  });
}