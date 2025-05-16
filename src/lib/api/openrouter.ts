if (!process.env.OPENROUTER_API_KEY) {
  throw new Error("Missing OPENROUTER_API_KEY environment variable")
}

const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1"

interface OpenRouterResponse {
  choices: {
    text: string;
    index: number;
    finish_reason: string;
  }[];
}

export async function generateWithModel(
  prompt: string,
  model: string = "anthropic/claude-2",
  temperature: number = 0.7
) {
  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.statusText}`)
    }

    const data: OpenRouterResponse = await response.json()
    return data.choices[0]?.text || ""
  } catch (error) {
    console.error("Error generating content with OpenRouter:", error)
    throw new Error("Failed to generate content")
  }
}

export async function compareOutputs(prompt: string) {
  try {
    const models = [
      "anthropic/claude-2",
      "google/palm-2-chat-bison",
      "meta-llama/llama-2-70b-chat",
    ]

    const results = await Promise.all(
      models.map(async (model) => {
        const output = await generateWithModel(prompt, model)
        return {
          model,
          output,
        }
      })
    )

    return results
  } catch (error) {
    console.error("Error comparing outputs:", error)
    throw new Error("Failed to compare outputs")
  }
}

export async function enhanceWithModel(
  content: string,
  enhancement: "creativity" | "clarity" | "conciseness" | "technical" | "casual",
  model: string = "anthropic/claude-2"
) {
  const prompts = {
    creativity: `Enhance the following content to be more creative and engaging while maintaining the core message:\n\n${content}`,
    clarity: `Improve the clarity and readability of the following content:\n\n${content}`,
    conciseness: `Make the following content more concise while preserving key information:\n\n${content}`,
    technical: `Adapt the following content to be more technical and professional:\n\n${content}`,
    casual: `Make the following content more casual and conversational:\n\n${content}`,
  }

  return generateWithModel(prompts[enhancement], model)
}

export async function analyzeWithModel(
  content: string,
  model: string = "anthropic/claude-2"
) {
  const prompt = `Analyze the following content and provide insights on:
1. Writing style and tone
2. Structure and organization
3. Key themes and messages
4. Potential areas for improvement

Content:
${content}

Provide a structured analysis focusing on these aspects.`

  return generateWithModel(prompt, model, 0.5)
}
