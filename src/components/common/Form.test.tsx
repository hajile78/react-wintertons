import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Form from './Form'

const hiddenAlert = {
  show: false,
  type: '',
  message: '',
}

describe('Form', () => {
  it('renders its title and children and invokes the submit handler', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault()
    })
    render(
      <Form
        id="profile-form"
        title="Profile"
        alert={hiddenAlert}
        onSubmit={onSubmit}
      >
        <label htmlFor="name">Name</label>
        <input id="name" name="name" />
      </Form>,
    )

    expect(
      screen.getByRole('heading', { name: 'Profile' }),
    ).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledOnce()
  })

  it('renders an alert conditionally and dismisses it', () => {
    vi.useFakeTimers()
    const onDismissAlert = vi.fn()
    const { rerender } = render(
      <Form
        id="profile-form"
        title="Profile"
        alert={{ show: true, type: 'success', message: 'Profile saved' }}
        onDismissAlert={onDismissAlert}
        onSubmit={vi.fn()}
      >
        <input aria-label="Name" />
      </Form>,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Profile saved')
    expect(screen.getByRole('alert')).toHaveClass('alert-success')

    act(() => {
      vi.advanceTimersByTime(2500)
    })
    expect(onDismissAlert).toHaveBeenCalledOnce()

    rerender(
      <Form
        id="profile-form"
        title="Profile"
        alert={hiddenAlert}
        onDismissAlert={onDismissAlert}
        onSubmit={vi.fn()}
      >
        <input aria-label="Name" />
      </Form>,
    )
    expect(screen.queryByText('Profile saved')).not.toBeInTheDocument()
  })

  it('tolerates a visible alert without a dismissal callback', () => {
    vi.useFakeTimers()
    render(
      <Form
        id="profile-form"
        title="Profile"
        alert={{ show: true, type: 'danger', message: 'Unable to save' }}
        onSubmit={vi.fn()}
      >
        <input aria-label="Name" />
      </Form>,
    )

    expect(() => {
      act(() => {
        vi.advanceTimersByTime(2500)
      })
    }).not.toThrow()
    expect(screen.getByRole('alert')).toHaveTextContent('Unable to save')
  })
})
