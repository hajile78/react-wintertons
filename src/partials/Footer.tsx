function Footer() {
	return (
		<footer className='w-full bg-gray-900 py-10 mt-auto'>
			<div className='max-w-7xl mx-auto px-6 text-center'>
				<p className='text-sm flex items-center justify-center gap-2 text-white'>
					<span>Copyright © Wintertons.us 2020 | Built with</span>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						viewBox='-11.5 -10.23174 23 20.46348'
						className='h-4'
					>
						<title>React Logo</title>
						<circle cx='0' cy='0' r='2.05' fill='#61dafb' />
						<g stroke='#61dafb' strokeWidth='1' fill='none'>
							<ellipse rx='11' ry='4.2' />
							<ellipse rx='11' ry='4.2' transform='rotate(60)' />
							<ellipse rx='11' ry='4.2' transform='rotate(120)' />
						</g>
					</svg>
				</p>
			</div>
		</footer>
	)
}

export default Footer
