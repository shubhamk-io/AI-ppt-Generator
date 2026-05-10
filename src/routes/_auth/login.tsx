import LoginForm from '#/components/auth.tsx/loginForm'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Presentation } from 'lucide-react'
import { z } from "zod"

export const Route = createFileRoute('/_auth/login')({
    validateSearch: z.object({
        redirect: z.string().optional()
    }),
    component: LoginPage,
})

function LoginPage() {

    const { redirect } = Route.useSearch()

    return (
        <div className="min-h-screen flex items-center justify-center p-4">

            <div className="w-full max-w-md">
                <div className="glass rounded-3xl p-8 space-y-6">

                    {/* Logo */}
                  

                    {/* ✅ Login Form INSIDE */}
                    <LoginForm redirectTo={redirect} />

                </div>
            </div>

        </div>
    )
}