import { Inter } from 'next/font/google'
import { AuthProvider } from "@/components/providers/session-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "AI Writing Assistant",
  description: "An AI-powered writing assistant for authors and content creators",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
