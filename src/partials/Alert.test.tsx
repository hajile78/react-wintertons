import { act, render, screen } from '@testing-library/react'
import Alert from './Alert'

describe('Alert', () => {
  it('renders the message and type class', () => {
    render(
      <Alert
        type="danger"
        message="Unable to save"
        removeAlert={vi.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Unable to save')
    expect(screen.getByRole('alert')).toHaveClass(
      'alert',
      'alert-danger',
    )
  })

  it('dismisses itself after 2.5 seconds', () => {
    vi.useFakeTimers()
    const removeAlert = vi.fn()
    render(
      <Alert type="success" message="Saved" removeAlert={removeAlert} />,
    )

    act(() => {
      vi.advanceTimersByTime(2499)
    })
    expect(removeAlert).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(removeAlert).toHaveBeenCalledOnce()
  })

  it('cancels its dismissal timer when unmounted', () => {
    vi.useFakeTimers()
    const removeAlert = vi.fn()
    const { unmount } = render(
      <Alert type="success" message="Saved" removeAlert={removeAlert} />,
    )

    unmount()
    act(() => {
      vi.advanceTimersByTime(2500)
    })

    expect(removeAlert).not.toHaveBeenCalled()
  })

  it('uses the latest dismissal callback', () => {
    vi.useFakeTimers()
    const firstRemoveAlert = vi.fn()
    const latestRemoveAlert = vi.fn()
    const { rerender } = render(
      <Alert
        type="success"
        message="Saved"
        removeAlert={firstRemoveAlert}
      />,
    )

    rerender(
      <Alert
        type="success"
        message="Saved"
        removeAlert={latestRemoveAlert}
      />,
    )
    act(() => {
      vi.advanceTimersByTime(2500)
    })

    expect(firstRemoveAlert).not.toHaveBeenCalled()
    expect(latestRemoveAlert).toHaveBeenCalledOnce()
  })
})
