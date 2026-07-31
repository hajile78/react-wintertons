import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import Header from './Header'

describe('Header', () => {
  it('renders the expected navigation destinations', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    const navigation = screen.getByRole('navigation')
    expect(within(navigation).getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(
      within(navigation).getByRole('link', { name: 'Elijah' }),
    ).toHaveAttribute('href', '/nav/Elijah')
    expect(within(navigation).getByRole('link', { name: 'Katie' })).toHaveAttribute(
      'href',
      '/nav/Katie',
    )
    expect(within(navigation).getByRole('link', { name: 'Kalob' })).toHaveAttribute(
      'href',
      '/nav/Kalob',
    )
    expect(within(navigation).getByRole('link', { name: 'Sam' })).toHaveAttribute(
      'href',
      '/nav/Sam',
    )
    expect(within(navigation).getByRole('link', { name: 'Ben' })).toHaveAttribute(
      'href',
      '/nav/Ben',
    )
  })

  it('opens and closes the mobile navigation menu', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    const openButton = screen.getByRole('button', {
      name: 'Open navigation menu',
    })
    expect(openButton).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getAllByRole('link', { name: 'Elijah' })).toHaveLength(1)

    await user.click(openButton)

    const closeButton = screen.getByRole('button', {
      name: 'Close navigation menu',
    })
    expect(closeButton).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByRole('link', { name: 'Elijah' })).toHaveLength(2)

    await user.click(closeButton)
    expect(
      screen.getByRole('button', { name: 'Open navigation menu' }),
    ).toHaveAttribute('aria-expanded', 'false')
    expect(screen.getAllByRole('link', { name: 'Elijah' })).toHaveLength(1)
  })
})
