"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { JSX, SVGProps, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardTitle } from "@/components/ui/card";

interface ChatMessage {
  role: "assistant" | "user" | "system";
  content: string;
}

interface SystemPrompt {
  id: number;
  title: string;
  prompt: string;
}

async function fetchSystemPrompts(): Promise<SystemPrompt[]> {
  const response = await fetch("/api/system-prompt");
  const data = await response.json();

  return data;
}

async function sendMessage(
  chatList: ChatMessage[],
  message: string,
  prompt?: string
) {
  const filteredChatList = chatList.filter((chat) => chat.role !== "system");

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify([
      ...(prompt ? [{ role: "system", content: prompt }] : []),
      ...filteredChatList,
      { role: "user", content: message },
    ]),
  });

  const data = await response.json();

  return data;
}

export default function MbtiBot() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);

  if (selectedCard !== null) {
    systemPrompts[selectedCard];
  }

  useEffect(() => {
    fetchSystemPrompts().then((data) => setSystemPrompts(data));
  }, []);

  const handleCardClick = (index: SetStateAction<number | null>) => {
    setSelectedCard(index);
  };

  const [message, setMessage] = useState("");
  const [chatList, setChatList] = useState<ChatMessage[]>([]);
  const handleSendMessage = async () => {
    const systemPrompt = selectedCard ? systemPrompts[selectedCard] : null;
    const data = await sendMessage(chatList, message, systemPrompt?.prompt);

    setChatList(data);
    setMessage("");
  };

  return (
    <>
      <header className="flex items-center justify-between bg-gray-900 px-4 py-3 shadow-md dark:bg-gray-200 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <ReplyIcon className="h-5 w-5 text-gray-400 dark:text-gray-900" />
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">
                <SmileIcon className="h-5 w-5 text-gray-400 dark:text-gray-900" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 space-y-1">
              {/* SystemPrompts 추가 코드 */}
              {/* <Card
                className={`p-2 relative ${"bg-white dark:bg-gray-950 hover:bg-gray-200 dark:hover:bg-gray-700"}`}
                onClick={() => router.push("/system-prompt/new")}
              >
                <CardTitle className="text-sm">
                  {" + New System Prompt"}
                </CardTitle>
              </Card> */}

              {systemPrompts.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => handleCardClick(index)}
                >
                  <CardTitle className="text-sm">{item.title}</CardTitle>
                </DropdownMenuItem>
              ))}
              {/* <DropdownMenuItem>{"T's Response"}</DropdownMenuItem>
              <DropdownMenuItem>{"F's Response"}</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-4">
          {/* <Button variant="ghost">
            <SettingsIcon className="h-5 w-5 text-gray-400 dark:text-gray-900" />
          </Button> */}
          <Button variant="ghost">
            <CircleHelpIcon className="h-5 w-5 text-gray-400 dark:text-gray-900" />
          </Button>
        </div>
      </header>
      <main className="flex h-[calc(100vh_-_theme(spacing.16))] flex-col bg-white">
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              {chatList
                .filter((chat) => chat.role !== "system")
                .map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-end justify-${
                      item.role === "assistant" ? "start" : "end"
                    } space-x-2`}
                  >
                    <div
                      className={`p-3 bg-${
                        item.role === "assistant"
                          ? "gray-200 dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                          : "blue-500"
                      } rounded-lg`}
                    >
                      {item.content}
                    </div>
                  </div>
                ))}

              {/* <Avatar>
                <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-800">
                <p>Hello, how can I assist you today?</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 justify-end">
              <div className="flex-1 rounded-md bg-gray-900 p-4 text-sm text-gray-50 dark:bg-gray-200 dark:text-gray-900">
                <p>
                  {
                    "I'm looking to create a new AI-powered chat application. Can you help me with the design?"
                  }
                </p>
              </div>
              <Avatar>
                <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <div className="flex-1 rounded-md bg-gray-100 p-4 text-sm dark:bg-gray-800">
                <p>
                  {
                    "Absolutely, I'd be happy to help. What kind of features are you looking for in your chat application?"
                  }
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-4 justify-end">
              <div className="flex-1 rounded-md bg-gray-900 p-4 text-sm text-gray-50 dark:bg-gray-200 dark:text-gray-900">
                <p>
                  {
                    "I'm looking for a simple yet sophisticated design with a focus on usability and responsiveness. The key features I'd like to include are a message input field, conversation history, and system prompt menus to customize the AI's tone and personality."
                  }
                </p>
              </div>
              <Avatar>
                <AvatarImage alt="User Avatar" src="/placeholder-avatar.jpg" />
                <AvatarFallback>You</AvatarFallback>
              </Avatar> */}
            </div>
          </div>
        </div>
        <div className="bg-gray-100 px-4 py-3 shadow-inner dark:bg-gray-200 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-4">
            <Textarea
              className="flex-1 rounded-md border-gray-300 bg-white px-4 py-2 text-sm shadow-sm transition-colors focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 dark:border-gray-200 dark:bg-white dark:text-black dark:focus:border-gray-500 dark:focus:ring-gray-500"
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button>
              <SendIcon
                className="h-5 w-5"
                onClick={(event: React.MouseEvent<HTMLButtonElement>) =>
                  handleSendMessage()
                }
              />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}

function CircleHelpIcon(
  props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function SmileIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M9 16c1.5 1 3.5 1 6 0" />
      <line x1="9" x2="9.01" y1="9" y2="9" />
      <line x1="15" x2="15.01" y1="9" y2="9" />
    </svg>
  );
}

function ReplyIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 17 4 12 9 7" />
      <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
    </svg>
  );
}

function SendIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}

// function SettingsIcon(
//   props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>
// ) {
//   return (
//     <svg
//       {...props}
//       xmlns="http://www.w3.org/2000/svg"
//       width="24"
//       height="24"
//       viewBox="0 0 24 24"
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
//       <circle cx="12" cy="12" r="3" />
//     </svg>
//   );
// }

function data(value: any) {
  throw new Error("Function not implemented.");
}
