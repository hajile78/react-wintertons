import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Header from './partials/Header'
import useGetQuotes from './hooks/useGetQuotes'
import { createRoutes } from './routes'
import Links from './partials/Links'
import Footer from './partials/Footer'
import RandomQuotes from './partials/RandomQuotes'

export default function Design2Layout() {
	const [menuOpen, setMenuOpen] = useState(false)
	const { quote, quotes, setQuote } = useGetQuotes()

	return (
		<>
			{/* Header */}
			<Header />

			{/* Main Layout */}
			<main className='max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-20 pb-20'>
				<Routes>
					{createRoutes(quotes, setQuote).map((route) => (
						<Route key={route.path} path={route.path} element={route.element} />
					))}
				</Routes>
				{/* Posts */}

				{/* Aside */}
				<aside className='space-y-6'>
					<RandomQuotes {...quote}></RandomQuotes>

					<Links></Links>
				</aside>
			</main>

			{/* Footer */}
			<Footer />
		</>
	)
}
