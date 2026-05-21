import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';

export const Route = createFileRoute('/presentation-$presentationId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { presentationId } = Route.useParams() 
  const navigate = useNavigate(); 

  const [activeSlideIndex, setActiveSlideIndex] = useState(0)  // ✅ typo: Indes → Index
  const [showSettings, setShowSettings] = useState(false)       // ✅ typo: sethSowSetting
  const [showSlideShow, setShowSlideShow] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  return <div>Hello "/presentation-$presentationId"!</div>
}