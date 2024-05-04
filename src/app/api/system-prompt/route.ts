import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const systemPrompts = await prisma.systemPrompt.findMany();
  return NextResponse.json(systemPrompts);
}