import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModalContext from '../context/ModalContext'
import type { ModalContextType } from '../types/ModalContextType'
import Modal from './Modal'

function renderModal(
  overrides: Partial<NonNullable<ModalContextType>> = {},
) {
  const value: NonNullable<ModalContextType> = {
    showModal: true,
    setShowModal: vi.fn(),
    modalText: {
      header: 'Family prayer',
      body: '<p>Prayer content</p>',
    },
    setModalText: vi.fn(),
    ...overrides,
  }

  return {
    value,
    ...render(
      <ModalContext.Provider value={value}>
        <Modal />
      </ModalContext.Provider>,
    ),
  }
}

describe('Modal', () => {
  it('stays hidden when the context says it is closed', () => {
    renderModal({ showModal: false })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders supplied content with dialog semantics', () => {
    renderModal()

    const dialog = screen.getByRole('dialog', { name: 'Family prayer' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
    expect(dialog).toHaveTextContent('Prayer content')
  })

  it('closes from the named close button', async () => {
    const user = userEvent.setup()
    const setShowModal = vi.fn()
    renderModal({ setShowModal })

    await user.click(screen.getByRole('button', { name: 'Close dialog' }))

    expect(setShowModal).toHaveBeenCalledWith(false)
  })

  it('closes from the backdrop', async () => {
    const user = userEvent.setup()
    const setShowModal = vi.fn()
    renderModal({ setShowModal })

    const backdrop = screen.getByRole('dialog').parentElement
    expect(backdrop).not.toBeNull()
    await user.click(backdrop!)

    expect(setShowModal).toHaveBeenCalledWith(false)
  })

  it('does not close when content inside the dialog is clicked', async () => {
    const user = userEvent.setup()
    const setShowModal = vi.fn()
    renderModal({ setShowModal })

    await user.click(screen.getByText('Prayer content'))

    expect(setShowModal).not.toHaveBeenCalled()
  })
})
