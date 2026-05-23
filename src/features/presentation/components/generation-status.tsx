import { Loader2, CheckCircle2, XCircle, FileEdit } from 'lucide-react'

type Status = 'DRAFT' | 'GENERATING' | 'COMPLETED' | 'FAILED'

type GenerationStatusProps = {
  status?: Status
}

const statusConfig: Record<Status, { icon: React.ElementType; label: string; className: string }> = {
  DRAFT: {
    icon: FileEdit,
    label: 'Draft',
    className: 'text-muted-foreground',
  },
  GENERATING: {
    icon: Loader2,
    label: 'Generating slides…',
    className: 'text-primary animate-spin',
  },
  COMPLETED: {
    icon: CheckCircle2,
    label: 'Ready',
    className: 'text-green-500',
  },
  FAILED: {
    icon: XCircle,
    label: 'Generation failed',
    className: 'text-destructive',
  },
}

export function GenerationStatus({ status }: GenerationStatusProps) {
  if (!status) return null

  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className={`size-4 ${config.className}`} />
      <span className={status === 'GENERATING' ? 'text-primary' : ''}>
        {config.label}
      </span>
    </div>
  )
}