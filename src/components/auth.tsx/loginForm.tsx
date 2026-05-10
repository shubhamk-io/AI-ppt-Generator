import { Link, useNavigate } from '@tanstack/react-router'
import { Presentation } from 'lucide-react'
import { FcGoogle } from "react-icons/fc"
import { FaGithub } from "react-icons/fa"
import { useState } from 'react'
import { authClient } from '#/lib/auth-client'
import { toast } from 'sonner'

export default function LoginForm({ redirectTo }: { redirectTo?: string }) {

  const [isSubmit, setIsSubmit] = useState<'github' | 'google' | null>(null)
  const navigate = useNavigate()

  const handleSocialLogin = async (provider: 'github' | 'google') => {
    try {
      setIsSubmit(provider)

      await authClient.signIn.social({
        provider,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Logged in successfully")
            navigate({ to: redirectTo || "/" })
          },

          onError: (error) => {
            toast.error(error?.message || "Failed to login")
            setIsSubmit(null)
          }
        }
      })

    } catch (error) {
      console.error(error)
      toast.error("Something went wrong")
      setIsSubmit(null)
    }
  }

  return (
    <div className="space-y-6">

      {/* Logo */}
      <div className="flex flex-col items-center gap-4">
        <Link to="/">
          <div className="size-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg hover:scale-105 transition">
            <Presentation className="size-9 text-white" />
          </div>
        </Link>

        <h1 className="text-3xl font-semibold text-center">
          Welcome
        </h1>

        <p className="text-muted-foreground text-sm">
          Sign in to create beautiful presentations.
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-3">

        {/* Google */}
        <button
          onClick={() => handleSocialLogin("google")}
          disabled={isSubmit !== null}
          className="w-full py-3 rounded-xl bg-white text-black font-medium flex items-center justify-center gap-3 border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.02] transition disabled:opacity-50"
        >
          <FcGoogle className="size-5" />
          {isSubmit === "google" ? "Loading..." : "Continue with Google"}
        </button>

        {/* GitHub */}
        <button
          onClick={() => handleSocialLogin("github")}
          disabled={isSubmit !== null}
          className="w-full py-3 rounded-xl bg-[#181717] text-white font-medium flex items-center justify-center gap-3 shadow-md hover:shadow-xl hover:scale-[1.02] transition disabled:opacity-50"
        >
          <FaGithub className="size-5" />
          {isSubmit === "github" ? "Loading..." : "Continue with GitHub"}
        </button>

      </div>

      {/* Footer */}
      <p className="text-center text-sm text-muted-foreground">
        Don’t have an account?{" "}
        <span className="text-primary cursor-pointer hover:underline">
          Sign up
        </span>
      </p>

    </div>
  )
}