import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json();
  console.log('Received message:', body.message);
  
  return NextResponse.json({ reply: `Echo: ${body.message}` });
}