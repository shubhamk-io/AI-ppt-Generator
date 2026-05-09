import { Switch } from '@/components/ui/switch'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  return (
    <div className="">
      <Switch />
    </div>
  )
}