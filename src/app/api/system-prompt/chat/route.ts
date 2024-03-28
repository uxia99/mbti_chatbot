import { NextRequest, NextResponse } from "next/server";
import { ChatOpenAI } from "@langchain/openai";
import { ChatPromptTemplate } from "@langchain/core/prompts";

interface ChatMessage {
  role: 'assistant' | 'user' | 'system';
  content: string;
}

export async function POST(req: NextRequest) {
  const messages: ChatMessage[] = await req.json();

  const convertedMessages: [string, string][] = messages.map((message) => [message.role, message.content]);
  const chain = getMessage(convertedMessages);

  const { content } = await chain.invoke({});
  const response = [
    ...messages,
    { role: 'assistant', content: content },
  ]
  return NextResponse.json(response);
}

function getMessage(convertedMessages: [string, string][]) {
  const prompt = ChatPromptTemplate.fromMessages(convertedMessages);
  const chatModel = new ChatOpenAI({});
  return prompt.pipe(chatModel);
}