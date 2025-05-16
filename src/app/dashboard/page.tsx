import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { AIAssistant } from "@/components/editor/ai-assistant"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/auth/signin")
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      aiCreditsUsed: true,
      aiCreditsLimit: true,
    },
  })

  if (!user) {
    redirect("/auth/signin")
  }

  const creditsRemaining = user.aiCreditsLimit - user.aiCreditsUsed

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">AI Writing Assistant</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Credits remaining: {creditsRemaining}
              </div>
              <div className="text-sm font-medium">
                {user.name || "User"}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Your Writing Space</h2>
            <textarea
              className="h-[500px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="Start writing here..."
            />
          </div>
          <div>
            <AIAssistant
              onInsertContent={(content) => {
                // TODO: Implement content insertion
                console.log("Content to insert:", content)
              }}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
