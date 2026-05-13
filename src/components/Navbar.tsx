import { authClient } from '#/lib/auth-client'
import { Link, useRouter } from '@tanstack/react-router'
import { LogOut, Moon, Presentation, Sun, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

type Theme = 'light' | 'dark'

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

export default function Navbar() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const initialTheme = getInitialTheme()
    setTheme(initialTheme)
    document.documentElement.classList.toggle("dark", initialTheme === "dark")
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    localStorage.setItem("theme", newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
  }

  const handleSignOut = async () => {
    await authClient.signOut()
    router.navigate({ to: "/login" })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      
      {/* Glow background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-primary/10 via-transparent to-primary/10 blur-2xl opacity-60" />

      <nav className="mx-auto max-w-6xl">
        
        {/* Glass Card */}
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-r from-primary/30 via-white/10 to-primary/30">
          
          <div className="flex items-center justify-between px-5 py-3 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl">

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 no-underline group"
            >
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-105 transition">
                <Presentation className="size-5 text-white" />
              </div>

              <span className="text-lg font-semibold tracking-tight">
                PPT
                <span className="bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                  .AI
                </span>
              </span>
            </Link>

            {/* Right side */}
            <div className="flex items-center gap-2">

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-xl hover:bg-white/10 transition"
              >
                {theme === 'dark' ? (
                  <Sun className="size-5" />
                ) : (
                  <Moon className="size-5" />
                )}
              </Button>

              {/* User */}
              {isPending ? (
                <div className="size-9 rounded-full bg-white/10 animate-pulse" />
              ) : session?.user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative size-9 rounded-full p-0 hover:ring-2 hover:ring-primary/40 transition"
                    >
                      <Avatar className="size-9 border-2 border-primary/30">
                        <AvatarImage src={session.user.image} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {session.user.name
                            ? session.user.name.charAt(0).toUpperCase()
                            : <User className="size-4" />}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 glass border border-white/10 backdrop-blur-xl bg-black/40"
                  >
                    <DropdownMenuLabel>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{session.user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={handleSignOut}
                      className="text-red-500 focus:text-red-500 cursor-pointer"
                    >
                      <LogOut className="mr-2 size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  size="sm"
                  className="rounded-xl bg-primary hover:scale-105 transition shadow-md shadow-primary/30"
                >
                  <Link to="/login">Sign in</Link>
                </Button>
              )}
            </div>

          </div>
        </div>

      </nav>
    </header>
  )
}