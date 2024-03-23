'use client'

import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

async function getSystemPrompt(id: number) {
  const response = await fetch(`/api/system-prompt/${id}`);
  const data = await response.json();
  return data;
}

export default function UpdateSystemPromptPage({ params }: { params: { id: number } }) {
  const router = useRouter();
  const { id } = params;
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
    const response = await fetch(`/api/system-prompt/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, prompt }),
    });
    router.push('/');
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSystemPrompt(id);
      setTitle(data.title);
      setPrompt(data.prompt);
    }
    fetchData();
  }, [])

  return (
    <main className="flex flex-col items-center justify-center min-h-screen w-full h-full py-12 bg-gray-50 sm:px-6 lg:px-8 dark:bg-gray-900">
      <Card className="w-full max-w-full mx-auto">
        <CardHeader>
          <CardTitle>Update System Prompt</CardTitle>
          <CardDescription>Enter the details for the new system prompt.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} placeholder="Enter the title" onChange={handleTitleChange}/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="prompt">Prompt</Label>
              <Textarea className="min-h-[100px]" id="prompt" value={prompt} placeholder="Enter the prompt" onChange={handlePromptChange} />
            </div>
            <Button className="w-full" type="submit" onClick={handleSubmit}>
              Update
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
