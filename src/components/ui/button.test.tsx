import { createRef } from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('forwards button attributes and its ref', () => {
    const ref = createRef<HTMLButtonElement>()

    render(
      <Button ref={ref} type="submit" aria-label="Save changes">
        Save
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Save changes' })
    expect(button).toHaveAttribute('type', 'submit')
    expect(ref.current).toBe(button)
  })

  it('applies variant and size classes', () => {
    render(
      <Button variant="destructive" size="lg">
        Delete
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass(
      'bg-destructive',
      'text-destructive-foreground',
      'h-10',
      'px-8',
    )
  })

  it('merges custom classes with later conflicting utilities winning', () => {
    render(<Button className="h-12 px-10 custom-button">Custom</Button>)

    expect(screen.getByRole('button', { name: 'Custom' })).toHaveClass(
      'h-12',
      'px-10',
      'custom-button',
    )
    expect(screen.getByRole('button', { name: 'Custom' })).not.toHaveClass(
      'h-9',
      'px-4',
    )
  })

  it('prevents interaction when disabled', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()
    render(
      <Button disabled onClick={onClick}>
        Save
      </Button>,
    )

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toBeDisabled()

    await user.click(button)

    expect(onClick).not.toHaveBeenCalled()
  })

  it('renders its child element when asChild is enabled', () => {
    render(
      <Button asChild variant="link">
        <a href="/account">Account</a>
      </Button>,
    )

    const link = screen.getByRole('link', { name: 'Account' })
    expect(link).toHaveAttribute('href', '/account')
    expect(link).toHaveClass('text-primary', 'underline-offset-4')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
