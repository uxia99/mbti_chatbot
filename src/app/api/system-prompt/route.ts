import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface CreateSystemPromptRequest {
  title: string;
  prompt: string;
}
const prisma = new PrismaClient();

export async function GET() {
  const systemPrompts = await prisma.systemPrompt.findMany();
  return NextResponse.json(systemPrompts);
}

export async function POST(req: NextRequest) {
  const { title, prompt }: CreateSystemPromptRequest = await req.json();

  const newSystemPrompt = await prisma.systemPrompt.create({
    data: {
      title,
      prompt,
    },
  });
  return NextResponse.json(newSystemPrompt);
}