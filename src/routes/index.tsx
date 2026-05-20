import { Button } from '#/components/ui/button'
import { Label } from '#/components/ui/label'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'
import {
  LAYOUT_OPTIONS,
  SLIDE_STYLES,
  TONE_OPTIONS
} from '#/features/presentation/constant/presentation-options'
import { PRESENTATION_TEMPLATES } from '#/features/presentation/constant/presentation-template'
import { getSession } from '#/lib/auth-function'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Wand2 } from 'lucide-react'
import { useState } from 'react'
import { createPresentation } from '#/features/actions/presentation-mutation';
import { toast } from 'sonner';
import { presentationQueryKeys } from '#/features/hooks/query-keys';

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
  const queryClinet = useQueryClient()
  const navigate = useNavigate()
  const [form, setForm] = useState<HomeFormState>({
    content: '',
    slideCount: 8,
    style: 'minimal',
    tone: 'formal',
    layout: 'balanced'
  })


  const creatMute = useMutation({
    mutationFn:() => createPresentation({
      data:{
        prompt: form.content.trim(),
        slideCount: form.slideCount,
        style: form.style,
        tone: form.tone,
        layout:form.layout
      }
    }),
    onSuccess:(presentation)=>{
      toast.success("Presentation created")
      queryClinet.invalidateQueries({queryKey:presentationQueryKeys.list()})
      navigate({
        to:"/presentation-$presentationId",
        params:{presentationId:presentation.id}
      })
    },
    onError:(Error)=>{
      toast.error("Could not create presentation")
    }
  })

  const handlCreate = ( ) => {
    if(!form.content.trim()){
      toast.error("Please enter your content first")
      return;

    };
    
    creatMute.mutate()
  }

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  const SLIDE_MIN = 3
  const SLIDE_MAX = 20

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

        {/* Main Card */}
        <div className="glass rounded-3xl p-6 md:p-8 space-y-6">

          {/* Textarea */}
          <div className="space-y-2">
            <Textarea
              placeholder="Describe your presentation topic..."
              value={form.content}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  content: e.target.value
                }))
              }
              className="h-[200px] rounded-2xl resize-none bg-background/60 border border-white/20 backdrop-blur-lg px-4 py-3 overflow-y-scroll no-scrollbar"
            />

            <div className="flex justify-between text-xs text-muted-foreground px-1">
              <span>{form.content.length} characters</span>
              <span className="text-purple-400/80">Markdown supported</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Slides */}
            <div className="space-y-2.5">
              <Label>Slides: {form.slideCount}</Label>
              <input
                type="range"
                min={SLIDE_MIN}
                max={SLIDE_MAX}
                value={form.slideCount}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    slideCount: Number(e.target.value)
                  }))
                }
                className="w-full accent-lime-500"
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
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="top"
                  align="start"
                  sideOffset={6}
                  avoidCollisions={false}
                  className="z-[9999] w-[--radix-select-trigger-width]"
                >
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
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="top"
                  align="start"
                  sideOffset={6}
                  avoidCollisions={false}
                  className="z-[9999] w-[--radix-select-trigger-width]"
                >
                  {TONE_OPTIONS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Layout */}
            <div className="space-y-2.5">
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
                <SelectTrigger className="rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  side="top"
                  align="start"
                  sideOffset={6}
                  avoidCollisions={false}
                  className="z-[9999] w-[--radix-select-trigger-width]"
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

          {/* Generate Button */}
          <div className="flex justify-end pt-2">
            <Button
            onClick={handlCreate}
            disabled={creatMute.isPending || !form.content.trim()}
              size="lg"
              className="rounded-xl px-8 gap-2 font-semibold text-white 
              bg-gradient-to-r from-lime-400 to-emerald-500 
              hover:from-lime-500 hover:to-emerald-600 
              shadow-md hover:shadow-lg transition-all"
            >
              <Wand2 size={16} />
              Generate PPT
            </Button>
          </div>

        </div>

        {/* Templates */}
        <div className="mt-6">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Try a Template
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {PRESENTATION_TEMPLATES.map((template) => {
              const isActive = selectedTemplate === template.id

              return (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setForm({
                      content: template.content,
                      slideCount: template.slides,
                      style: template.style,
                      tone: template.tone,
                      layout: template.layout
                    })
                  }}
                  className={`w-full px-3 py-2 text-sm rounded-xl border transition-all
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-lime-400 to-emerald-500 text-white scale-[1.03] shadow-md'
                      : 'border-border/50 bg-card/50 text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  {template.label}
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </main>
  )
}