import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ModalContext from '../context/ModalContext'
import type { ModalContextType } from '../types/ModalContextType'
import Links from './Links'

function renderLinks() {
  const value: NonNullable<ModalContextType> = {
    showModal: false,
    setShowModal: vi.fn(),
    modalText: null,
    setModalText: vi.fn(),
  }

  return {
    value,
    ...render(
      <ModalContext.Provider value={value}>
        <Links />
      </ModalContext.Provider>,
    ),
  }
}

describe('Links', () => {
  it('opens the prayer modal with its content', async () => {
    const user = userEvent.setup()
    const { value } = renderLinks()

    await user.click(
      screen.getByRole('button', { name: 'Winterton Prayer' }),
    )

    expect(value.setModalText).toHaveBeenCalledWith({
      header:
        'PRAYER FOR THE AUTHOR AND OTHER WINTERTONS WHO GROW OLDER DAY BY DAY',
      body: expect.stringContaining('Lord, thou knowest better'),
    })
    expect(value.setShowModal).toHaveBeenCalledWith(true)
  })

  it('opens both external resources in a new tab', async () => {
    const user = userEvent.setup()
    const open = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderLinks()

    await user.click(
      screen.getByRole('button', { name: 'Winterton Pioneers' }),
    )
    await user.click(
      screen.getByRole('button', { name: "Winterton History Doc's" }),
    )

    expect(open).toHaveBeenNthCalledWith(
      1,
      'http://www.jackandsharensimmons.com/pioneers/index.htm',
      '_blank',
    )
    expect(open).toHaveBeenNthCalledWith(
      2,
      'http://www.jackandsharensimmons.com',
      '_blank',
    )
  })
})
