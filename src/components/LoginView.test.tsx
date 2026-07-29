import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginView from './LoginView'

const hiddenAlert = { show: false, type: '', message: '' }

describe('LoginView', () => {
  it('renders accessible required credential fields', () => {
    render(
      <LoginView
        alert={hiddenAlert}
        onSubmit={vi.fn()}
        onDismissAlert={vi.fn()}
      />,
    )

    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Email')).toBeRequired()
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Password')).toBeRequired()
  })

  it('submits entered credentials without browser navigation and resets the form', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <LoginView
        alert={hiddenAlert}
        onSubmit={onSubmit}
        onDismissAlert={vi.fn()}
      />,
    )

    const email = screen.getByLabelText('Email')
    const password = screen.getByLabelText('Password')
    await user.type(email, 'person@example.com')
    await user.type(password, 'correct horse')
    await user.click(screen.getByRole('button', { name: 'Submit' }))

    expect(onSubmit).toHaveBeenCalledWith(
      'person@example.com',
      'correct horse',
    )
    expect(email).toHaveValue('')
    expect(password).toHaveValue('')
  })

  it('renders and dismisses an alert', () => {
    vi.useFakeTimers()
    const onDismissAlert = vi.fn()
    render(
      <LoginView
        alert={{ show: true, type: 'danger', message: 'Login failed' }}
        onSubmit={vi.fn()}
        onDismissAlert={onDismissAlert}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Login failed')
    act(() => vi.advanceTimersByTime(2500))
    expect(onDismissAlert).toHaveBeenCalledOnce()
  })
})
