import { Card, CardContent } from '@/components/ui/card'
import { Quote } from './quoteForm/Quote'

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
				<div role='status' aria-live='polite'>Loading quote...</div>
			)}
		</div>
	)
}

export default RandomQuotes
