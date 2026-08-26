import { Card, CardContent } from '@/components/ui/card'
import { Quote } from './quoteForm/Quote'
import { CardSkeleton } from '@/components/ui/cardSkeleton'

function RandomQuotes(quote: Quote) {
	return (
		<div className='quote'>
			{quote.quote ? (
				<Card className='rounded-2xl shadow-md bg-[#ddd]'>
					<CardContent className='p-6'>
						<h4 className='text-xl font-semibold mb-4'>Random Quotes</h4>
						<blockquote className='text-xl italic tracking-tight'>
							<p>"{quote.quote}"</p>
							<footer className='font-bold before:content-["--_"] before:mr-1'>
								{quote.author}
							</footer>
						</blockquote>
					</CardContent>
				</Card>
			) : (
				<CardSkeleton
					label='Loading quote'
					cardClassName='shadow-md bg-[#ddd]'
					lines={[
						'h-7 w-40',
						'mt-4 h-6 w-full',
						'mt-2 h-6 w-4/5',
						'mt-3 h-5 w-1/3',
					]}
				/>
			)}
		</div>
	)
}

export default RandomQuotes
