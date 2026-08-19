import { FormEvent } from 'react'
import Form from '../../components/common/Form'
import { Quote } from './Quote'

interface QuoteFormViewProps {
	quotes: Quote[]
	loading: boolean
	queryError?: boolean
	alert: { show: boolean; message: string; type: string }
	onSubmit: (quote: string, author: string) => void
	onDismissAlert: () => void
}

export default function QuoteFormView({
	quotes,
	loading,
	queryError = false,
	alert,
	onSubmit,
	onDismissAlert,
}: QuoteFormViewProps) {
	const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const form = e.currentTarget
		const quote = (form.elements.namedItem('quote') as HTMLInputElement).value
		const author = (form.elements.namedItem('author') as HTMLInputElement).value
		onSubmit(quote, author)
		form.reset()
	}

	return (
		<div className='col-span-2 flex flex-col gap-14'>
			<Form
				id='addQuotes'
				title='Add new quote'
				onSubmit={handleFormSubmit}
				alert={alert}
				onDismissAlert={onDismissAlert}
			>
				<fieldset className='flex flex-col gap-5'>
					<legend className='sr-only'>Quote details</legend>
					<div className='flex flex-col gap-2'>
						<label htmlFor='quote' className='text-sm font-bold text-slate-700'>
							Quote
						</label>
						<input
							id='quote'
							type='text'
							name='quote'
							required
							placeholder='Something worth remembering...'
							className='rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20'
						/>
					</div>
					<div className='flex flex-col gap-2'>
						<div className='flex items-baseline gap-2'>
							<label
								htmlFor='author'
								className='text-sm font-bold text-slate-700'
							>
								Author
							</label>
							<span className='text-xs text-slate-400'>(optional)</span>
						</div>
						<input
							id='author'
							type='text'
							name='author'
							placeholder='Who said it?'
							className='rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-orange-500 focus:bg-white focus:ring-2 focus:ring-orange-500/20'
						/>
					</div>
				</fieldset>
			</Form>
			<section>
				<div className='mb-6 flex items-end justify-between gap-4 border-b border-slate-200 pb-4'>
					<div>
						<p className='mb-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-700'>
							The family archive
						</p>
						<h2 className='text-3xl font-black tracking-tight text-slate-950'>
							Quotes in the database
						</h2>
					</div>
					<span className='shrink-0 rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-700'>
						{quotes.length}
					</span>
				</div>
				{queryError ? (
					<div
						role='alert'
						className='rounded-xl border border-red-200 bg-red-50 px-5 py-4 font-medium text-red-700'
					>
						Error loading quotes.
					</div>
				) : loading ? (
					<div
						role='status'
						aria-live='polite'
						className='rounded-xl border border-slate-200 bg-white px-5 py-4 text-slate-500 shadow-sm'
					>
						Loading quotes...
					</div>
				) : (
					<figure className='grid gap-4'>
						{quotes.map((quote, index) => (
							<div
								key={index}
								className='flex min-h-24 flex-col justify-between rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg'
							>
								<blockquote className='text-lg font-semibold leading-relaxed text-slate-800'>
									<p className="inline before:content-['“'] after:content-['”']">
										{quote.quote}
									</p>
								</blockquote>
								<figcaption className='mt-3 text-sm font-bold text-sky-800'>
									<span aria-hidden='true'>- </span>
									{quote.author || 'Unknown author'}
								</figcaption>
							</div>
						))}
					</figure>
				)}
			</section>
		</div>
	)
}
