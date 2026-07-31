import { render, screen } from '@testing-library/react'
import Footer from './Footer'

it('renders the copyright and product text', () => {
  render(<Footer />)

  expect(
    screen.getByText('Copyright © Wintertons.us 2020 | Built with'),
  ).toBeInTheDocument()
  expect(screen.getByTitle('React Logo')).toBeInTheDocument()
})
