import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/presentation-$presentationId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/presentation-$presentationId"!</div>
}
