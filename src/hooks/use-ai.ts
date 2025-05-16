import { useState } from "react"

interface AIResponse {
  result?: string
  error?: string
}

interface UseAIOptions {
  onSuccess?: (result: string) => void
  onError?: (error: string) => void
}

export function useAI(options: UseAIOptions = {}) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function generateWithGemini(
    action: "generate" | "improve" | "suggest-chapters" | "analyze",
    content: string
  ): Promise<AIResponse> {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, content }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content")
      }

      options.onSuccess?.(data.result)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      options.onError?.(errorMessage)
      return { error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  async function generateWithOpenRouter(
    action: "generate" | "compare" | "enhance" | "analyze",
    content: string,
    model?: string,
    enhancement?: "creativity" | "clarity" | "conciseness" | "technical" | "casual"
  ): Promise<AIResponse> {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/openrouter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, content, model, enhancement }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate content")
      }

      options.onSuccess?.(data.result)
      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      options.onError?.(errorMessage)
      return { error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    generateWithGemini,
    generateWithOpenRouter,
  }
}
