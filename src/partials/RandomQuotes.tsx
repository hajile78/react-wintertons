import { Card, CardContent } from '@/components/ui/card'
import { Quote } from './quoteForm/Quote'

function RandomQuotes(quote: Quote) {
	//const {quote} = useGetQuotes()

	return (
		<div className='quote'>
			{quote ? (
				<Card className='rounded-2xl shadow-md bg-[#ddd]'>
					<CardContent className='p-6'>
						<h4 className='text-xl font-semibold mb-4'>Random Quotes</h4>
						<p className='text-sm'>
							<blockquote className='text-xl italic tracking-tight'>
								<p>"{quote.quote}"</p>
								<footer className='font-bold before:content-["--_"] before:mr-1'>
									{quote.author}
								</footer>
							</blockquote>
						</p>
					</CardContent>
				</Card>
			) : (
				<>...Loading</>
			)}
		</div>
	)
}

export default RandomQuotes
