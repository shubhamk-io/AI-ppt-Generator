import { Button } from '#/components/ui/button';
import { usePresentationDetail } from '#/hooks/use-presentation-detail'; // ✅ fixed typo
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router' // ✅ added Link
import { useState } from 'react';

export const Route = createFileRoute('/presentation-$presentationId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { presentationId } = Route.useParams() 
  const navigate = useNavigate(); 

  const [activeSlideIndex, setActiveSlideIndex] = useState(0)
  const [showSettings, setShowSettings] = useState(false)
  const [showSlideShow, setShowSlideShow] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const {
    query,
    slides,
    isGenerating,
    updatedLabel,
    form,
    setForm,
    updateMut,
    regenerateMut,
    deleteMut,
  } = usePresentationDetail(presentationId, { // ✅ () not {}
    onDeleted: () => navigate({ to: "/" }),
  })

  if (query.isPending) {
    return (
      <main className='min-h-screen pt-24 pb-12 px-4'>
        <div className='max-w-6xl mx-auto text-muted-foreground'> {/* ✅ mx-auto */}
          Loading presentation...
        </div>
      </main>
    )
  }

  if (query.isError) {
    return (
      <main className='min-h-screen pt-24 pb-12 px-4'>
        <div className='max-w-6xl mx-auto space-y-4'>
          <p className='text-destructive'>
            {query.error instanceof Error ? query.error.message : "Something went wrong"} {/* ✅ query.error */}
          </p>
          <Button asChild variant="outline" className='rounded-xl'>
            <Link to="/">Back home</Link>
          </Button>
        </div>
      </main>
    )
  }

  return <div>Hello "/presentation-$presentationId"!</div>
}