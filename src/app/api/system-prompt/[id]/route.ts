import { PrismaClient } from '@prisma/client'
import { NextRequest, NextResponse } from "next/server";

interface UpdateSystemPromptRequest {
  id: number;
  title: string;
  prompt: string;
}

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const systemPrompt = await prisma.systemPrompt.findUnique({
    where: {
      id: parseInt(id),
    },
  });
  return NextResponse.json(systemPrompt);
}

// export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
//   const { title, prompt }: UpdateSystemPromptRequest = await req.json();
//   const { id } = params;

//   const updatedSystemPrompt = await prisma.systemPrompt.update({
//     where: {
//       id: parseInt(id),
//     },
//     data: {
//       title,
//       prompt,
//     },
//   });
//   return NextResponse.json(updatedSystemPrompt);
// }