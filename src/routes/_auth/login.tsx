import LoginForm from '#/components/auth.tsx/loginForm'
import { getSession } from '#/lib/auth-function'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { z } from "zod"

export const Route = createFileRoute('/_auth/login')({

    beforeLoad: async ({ location }) => {
        const session = await getSession();
    
        // 🔒 Protect route
        if (session) {
          throw redirect({
            to: "/",
            search: {
              redirect: location.href,
            },
          });
        }
    

       
      },

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