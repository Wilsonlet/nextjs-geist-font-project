import { SignInForm } from "@/components/auth/sign-in-form"

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Sign in to your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email below to sign in to your account
          </p>
        </div>
        <SignInForm />
      </div>
    </div>
  )
}
