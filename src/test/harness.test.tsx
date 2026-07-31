import { screen } from './render'
import { renderWithProviders } from './render'

function HarnessSmokeTest() {
  return <h1>Test harness ready</h1>
}

it('renders React content with the shared providers', () => {
  renderWithProviders(<HarnessSmokeTest />)

  expect(
    screen.getByRole('heading', { name: 'Test harness ready' }),
  ).toBeVisible()
})
