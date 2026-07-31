import { createRef } from 'react'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card'

describe('Card', () => {
  it('renders the composed card sections with their default classes', () => {
    render(
      <Card aria-label="Profile">
        <CardHeader>
          <CardTitle>Winterton family</CardTitle>
          <CardDescription>Family profile</CardDescription>
        </CardHeader>
        <CardContent>Profile details</CardContent>
        <CardFooter>Updated today</CardFooter>
      </Card>,
    )

    expect(screen.getByLabelText('Profile')).toHaveClass(
      'rounded-xl',
      'border',
      'bg-card',
      'shadow',
    )
    expect(screen.getByText('Winterton family')).toHaveClass(
      'font-semibold',
      'tracking-tight',
    )
    expect(screen.getByText('Family profile')).toHaveClass(
      'text-sm',
      'text-muted-foreground',
    )
    expect(screen.getByText('Profile details')).toHaveClass('p-6', 'pt-0')
    expect(screen.getByText('Updated today')).toHaveClass(
      'flex',
      'items-center',
      'p-6',
      'pt-0',
    )
  })

  it('forwards attributes and its ref', () => {
    const ref = createRef<HTMLDivElement>()

    render(
      <Card ref={ref} data-state="selected">
        Details
      </Card>,
    )

    const card = screen.getByText('Details')
    expect(card).toHaveAttribute('data-state', 'selected')
    expect(ref.current).toBe(card)
  })

  it('merges custom classes with later conflicting utilities winning', () => {
    render(
      <Card className="rounded-none custom-card">
        <CardHeader className="p-2">Header</CardHeader>
      </Card>,
    )

    expect(screen.getByText('Header').parentElement).toHaveClass(
      'rounded-none',
      'custom-card',
    )
    expect(screen.getByText('Header').parentElement).not.toHaveClass(
      'rounded-xl',
    )
    expect(screen.getByText('Header')).toHaveClass('p-2')
    expect(screen.getByText('Header')).not.toHaveClass('p-6')
  })
})
