
import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '#/components/ui/select'
import { Slider } from '#/components/ui/slider'
import { Textarea } from '#/components/ui/textarea'
import {
  LAYOUT_OPTIONS,
  SLIDE_STYLES,
  TONE_OPTIONS
} from '#/features/presentation/constant/presentation-options'
import { getSession } from '#/lib/auth-function'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'

type HomeFormState = {
  content: string
  slideCount: number
  style: (typeof SLIDE_STYLES)[number]['value']
  tone: (typeof TONE_OPTIONS)[number]['value']
  layout: (typeof LAYOUT_OPTIONS)[number]['value']
}

export const Route = createFileRoute('/')({
  beforeLoad: async ({ location }) => {
    const session = await getSession()

    if (!session) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href }
      })
    }

    return { user: session.user }
  },
  component: Home
})

function Home() {
  const [form, setForm] = useState<HomeFormState>({
    content: '',
    slideCount: 8,
    style: 'minimal',
    tone: 'formal',
    layout: 'balanced'
  })

  return (
    <main className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mt-5 mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            What do you want to{' '}
            <span className="bg-gradient-to-r from-pink-500 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
              create?
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Enter your content and we'll generate a beautiful presentation
          </p>
        </div>

        {/* 🔥 FIXED: overflow-visible */}
        <div className="glass rounded-3xl p-6 md:p-8 space-y-6 relative overflow-visible">

          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-blue-500/10 opacity-60 blur-2xl pointer-events-none" />

          {/* Textarea */}
          <div className="space-y-2 relative group">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-blue-500/30 opacity-0 group-hover:opacity-100 blur-lg transition duration-500" />

            <Textarea
              placeholder="Describe your presentation topic..."
              value={form.content}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  content: e.target.value
                }))
              }
              className="relative z-10 h-[200px] rounded-2xl resize-none bg-background/60 border border-white/20 backdrop-blur-lg px-4 py-3 transition-all duration-300 focus-visible:ring-2 focus-visible:ring-pink-400/50"
            />

            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{form.content.length.toLocaleString()} characters</span>
              <span className="text-purple-400/80">Markdown supported</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Slides */}
            <div className="space-y-2.5">
              <Label>Slides: {form.slideCount}</Label>
              <Slider
                value={[form.slideCount]}
                onValueChange={([v]) =>
                  setForm((s) => ({
                    ...s,
                    slideCount: v
                  }))
                }
                min={3}
                max={20}
                step={1}
                className="py-2"
              />
            </div>

            {/* Style */}
            <div className="space-y-2.5">
              <Label>Style</Label>
              <Select
                value={form.style}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    style: value as HomeFormState['style']
                  }))
                }
              >
                <SelectTrigger className="bg-background/50 border-border/50 rounded-xl relative z-10">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="glass z-50">
                  {SLIDE_STYLES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tone */}
            <div className="space-y-2.5">
              <Label>Tone</Label>
              <Select
                value={form.tone}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    tone: value as HomeFormState['tone']
                  }))
                }
              >
                <SelectTrigger className="bg-background/50 border-border/50 rounded-xl relative z-10">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="glass z-50">
                  {TONE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ✅ FIXED Layout */}
            <div className="space-y-2.5 relative">
              <Label>Layout</Label>

              <Select
                value={form.layout}
                onValueChange={(value) =>
                  setForm((s) => ({
                    ...s,
                    layout: value as HomeFormState['layout']
                  }))
                }
              >
                <SelectTrigger className="bg-background/50 border-border/50 rounded-xl relative z-10">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  className="glass z-50"
                >
                  {LAYOUT_OPTIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

          </div>



          {/* Button */}
          {/* <div className="flex justify-end pt-2">
            <Button
              size="lg"
              onClick={handleGenerate}
              disabled={createMut.isPending || !form.content.trim()}
              className="rounded-xl px-8 gap-2 font-semibold"
            >
              {createMut.isPending ? (
                <>
                  <Sparkles className="size-5 animate-pulse" />
                  Creating…
                </>
              ) : (
                <>
                  <Wand2 className="size-5" />
                  Generate PPT
                </>
              )}
            </Button>
          </div> */}

        </div>
      </div>
    </main>
  )
}