import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { buildQuote } from '../test/fixtures'
import { createRoutes } from './index'

const mocks = vi.hoisted(() => ({
	postsContainer: vi.fn(),
	isAuthenticated: false,
	hasRole: vi.fn(),
}))

vi.mock('../partials/PostsContainer', () => ({
	default: (props: unknown) => {
		mocks.postsContainer(props)
		return 'Posts screen'
	},
}))

vi.mock('../partials/quoteForm/QuoteFormContainer', () => ({
	default: () => 'Quote form screen',
}))

vi.mock('../partials/PostsForm', () => ({
	default: () => 'Post form screen',
}))

vi.mock('../components/LoginContainer', () => ({
	default: () => 'Login screen',
}))

vi.mock('../context/AuthContext', () => ({
	useAuth: () => ({
		user: null,
		login: vi.fn(),
		logout: vi.fn(),
		isAuthenticated: mocks.isAuthenticated,
		hasRole: mocks.hasRole,
	}),
}))

function renderRoute(
	initialEntry: string,
	quotes = [buildQuote()],
	setQuote = vi.fn()
) {
	const routes = createRoutes(quotes, setQuote)

	return {
		quotes,
		setQuote,
		...render(
			<MemoryRouter initialEntries={[initialEntry]}>
				<Routes>
					{routes.map((route) => (
						<Route key={route.path} path={route.path} element={route.element} />
					))}
				</Routes>
			</MemoryRouter>
		),
	}
}

describe('createRoutes', () => {
	beforeEach(() => {
		mocks.isAuthenticated = false
		mocks.hasRole.mockReturnValue(false)
	})

	it('defines the six expected paths', () => {
		expect(createRoutes([], vi.fn()).map((route) => route.path)).toEqual([
			'/nav/:slug',
			'/post/:id',
			'/addQuote',
			'/addPost',
			'/login',
			'/',
		])
	})

	it.each([
		['/', 'Posts screen'],
		['/nav/Elijah', 'Posts screen'],
		['/post/post-42', 'Posts screen'],
		['/addQuote', 'Quote form screen'],
		['/login', 'Login screen'],
	])('renders the public screen for %s', (path, screenText) => {
		renderRoute(path)

		expect(screen.getByText(screenText)).toBeInTheDocument()
	})

	it('renders the post form without authentication', () => {
		renderRoute('/addPost')

		expect(screen.getByText('Post form screen')).toBeInTheDocument()
	})

	it('passes quotes and the setter to post routes', () => {
		const quotes = [buildQuote({ quote: 'Wired quote' })]
		const setQuote = vi.fn()

		renderRoute('/nav/Katie', quotes, setQuote)

		expect(mocks.postsContainer).toHaveBeenCalledWith({
			quotes,
			setQuote,
		})
	})
})
