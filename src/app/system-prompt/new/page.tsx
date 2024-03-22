'use client'

import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function CreateSystemPromptPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [prompt, setPrompt] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  }

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
  }

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const response = await fetch('/api/system-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, prompt }),
    });
    router.push('/');
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full h-full py-12 bg-gray-50 sm:px-6 lg:px-8 dark:bg-gray-900">
      <Card className="w-full max-w-full mx-auto">
        <CardHeader>
          <CardTitle>Create System Prompt</CardTitle>
          <CardDescription>Enter the details for the new system prompt.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter the title" onChange={handleTitleChange}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea className="min-h-[100px]" id="prompt" placeholder="Enter the prompt" onChange={handlePromptChange} />
            </div>
            <Button className="w-full" type="submit" onClick={handleSubmit}>
              Create
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
