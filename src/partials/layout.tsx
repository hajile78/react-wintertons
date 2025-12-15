import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'

import Header from './Header'
import useGetQuotes from '../hooks/useGetQuotes'
import { createRoutes } from '../routes'
import Links from './Links'
import Footer from './Footer'
import RandomQuotes from './RandomQuotes'

export default function Layout() {
	const [menuOpen, setMenuOpen] = useState(false)
	const { quote, quotes, setQuote } = useGetQuotes()

	return (
		<div className='min-h-screen flex flex-col gap'>
			{/* Header */}
			<Header />

			{/* Main Layout */}
			<main className='max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-10 mt-20 pb-20'>
				{/* Posts */}
				<Routes>
					{createRoutes(quotes, setQuote).map((route) => (
						<Route key={route.path} path={route.path} element={route.element} />
					))}
				</Routes>

				{/* Aside */}
				<aside className='space-y-6'>
					<RandomQuotes {...quote}></RandomQuotes>
					<Links></Links>
				</aside>
			</main>

			{/* Footer */}
			<Footer />
		</div>
	)
}
