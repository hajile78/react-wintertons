import { cn } from '@/lib/utils'
import { Card, CardContent } from './card'

interface CardSkeletonProps {
  label?: string
  className?: string
  cardClassName?: string
  contentClassName?: string
  lines?: string[]
}

const defaultLines = [
  'h-8 w-2/3',
  'mt-3 h-4 w-1/4',
  'mt-8 h-4 w-full',
  'mt-3 h-4 w-full',
  'mt-3 h-4 w-4/5',
]

export function CardSkeleton({
  label = 'Loading content',
  className,
  cardClassName,
  contentClassName,
  lines = defaultLines,
}: CardSkeletonProps) {
  return (
    <div
      role="status"
      aria-label={label}
      aria-live="polite"
      className={className}
    >
      <Card
        className={cn(
          'rounded-2xl shadow-lg overflow-hidden bg-token-surface',
          cardClassName,
        )}
      >
        <CardContent className={cn('p-6 animate-pulse', contentClassName)}>
          {lines.map((lineClassName, index) => (
            <div
              key={`${lineClassName}-${index}`}
              className={cn(
                'rounded bg-gray-300 dark:bg-gray-700',
                lineClassName,
              )}
            />
          ))}
          <span className="sr-only">{label}...</span>
        </CardContent>
      </Card>
    </div>
  )
}
