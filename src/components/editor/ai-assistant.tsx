import { useState } from "react"
import { useAI } from "@/hooks/use-ai"

interface AIAssistantProps {
  onInsertContent: (content: string) => void
}

export function AIAssistant({ onInsertContent }: AIAssistantProps) {
  const [prompt, setPrompt] = useState("")
  const [selectedModel, setSelectedModel] = useState<"gemini" | "openrouter">("gemini")
  const [enhancement, setEnhancement] = useState<
    "creativity" | "clarity" | "conciseness" | "technical" | "casual"
  >("clarity")

  const { isLoading, error, generateWithGemini, generateWithOpenRouter } = useAI({
    onSuccess: (result) => {
      onInsertContent(result)
      setPrompt("")
    },
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    if (!prompt.trim()) return

    if (selectedModel === "gemini") {
      await generateWithGemini("generate", prompt)
    } else {
      await generateWithOpenRouter("enhance", prompt, undefined, enhancement)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">AI Writing Assistant</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as "gemini" | "openrouter")}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="gemini">Gemini</option>
            <option value="openrouter">OpenRouter (Multiple Models)</option>
          </select>
        </div>

        {selectedModel === "openrouter" && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Enhancement Type</label>
            <select
              value={enhancement}
              onChange={(e) =>
                setEnhancement(
                  e.target.value as "creativity" | "clarity" | "conciseness" | "technical" | "casual"
                )
              }
              className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="creativity">Enhance Creativity</option>
              <option value="clarity">Improve Clarity</option>
              <option value="conciseness">Make Concise</option>
              <option value="technical">Technical Style</option>
              <option value="casual">Casual Style</option>
            </select>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt or text to enhance..."
            className="h-32 w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? "Generating..." : "Generate"}
        </button>
      </form>
    </div>
  )
}
