
import ThemeToggle from '#/components/ui/Theme-toggle'
import { authClient } from '#/lib/auth-client'
import { getSession } from '#/lib/auth-function'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute("/")({
  beforeLoad: async ({ location }) => {
    const session = await getSession();

    // 🔒 Protect route
    if (!session) {
      throw redirect({
        to: "/login",
        search: {
          redirect: location.href,
        },
      });
    }

    // ✅ Pass user data
    return {
      user: session.user,
    };
  },
  component: Home })

function Home() {

  return (
  <div>
   <h1>Hello</h1>
  </div>
  )
}
