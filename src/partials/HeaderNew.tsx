import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HeaderNew() {
	const [menuOpen, setMenuOpen] = useState(false)
	return (
		<header className='w-full bg-[#1e40af] shadow-sm fixed top-0 left-0 z-50 text-[#fb8500]'>
			<div className='max-w-7xl mx-auto px-6 py-4 flex items-center justify-between'>
				<h1 className='text-2xl font-bold'>Wintertons.us</h1>

				{/* Desktop Nav */}
				<nav className='space-x-6 text-lg font-bold hidden md:block'>
					<Link className='hover:text-blue-600' to={'/#'}>
						Home
					</Link>
					<Link className='hover:text-blue-600' to={'/nav/Elijah'}>
						Elijah
					</Link>
					<Link className='hover:text-blue-600' to={'/nav/Katie'}>
						Katie
					</Link>
					<Link className='hover:text-blue-600' to={'/nav/Kalob'}>
						Kalob
					</Link>
					<Link className='hover:text-blue-600' to={'/nav/Sam'}>
						Sam
					</Link>
					<Link className='hover:text-blue-600' to={'/nav/Ben'}>
						Ben
					</Link>
				</nav>

				{/* Mobile Toggle */}
				<button
					onClick={() => setMenuOpen(!menuOpen)}
					className='md:hidden p-2 rounded hover:bg-gray-100'
				>
					{menuOpen ? <X size={26} /> : <Menu size={26} />}
				</button>
			</div>

			{/* Mobile Menu */}
			{menuOpen && (
				<div className='md:hidden bg-white shadow-inner border-t p-6 space-y-4'>
					<Link className='block text-lg hover:text-blue-600' to={'/#'}>
						Home
					</Link>
					<Link
						className='block text-lg hover:text-blue-600'
						to={'/nav/Elijah'}
					>
						Elijah
					</Link>
					<Link className='block text-lg hover:text-blue-600' to={'/nav/Katie'}>
						Katie
					</Link>
					<Link className='block text-lg hover:text-blue-600' to={'/nav/Kalob'}>
						Kalob
					</Link>
					<Link className='block text-lg hover:text-blue-600' to={'/nav/Sam'}>
						Sam
					</Link>
					<Link className='block text-lg hover:text-blue-600' to={'/nav/Ben'}>
						Ben
					</Link>
				</div>
			)}
		</header>
	)
}
