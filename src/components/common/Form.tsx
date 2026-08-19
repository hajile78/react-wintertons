import { FormEvent, ReactNode } from 'react'
import Alert from '../../partials/Alert'
import { AlertState } from '../../types/AlertType'

interface FormProps<T extends HTMLFormElement = HTMLFormElement> {
	onSubmit: (e: FormEvent<T>) => void | Promise<void>
	alert: AlertState
	onDismissAlert?: () => void
	children: ReactNode
	id: string
	title: string
}

function Form<T extends HTMLFormElement = HTMLFormElement>({
	onSubmit,
	alert,
	onDismissAlert,
	children,
	id,
	title,
}: FormProps<T>) {
	const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
		onSubmit(e as FormEvent<T>)
	}

	return (
		<div className='col-span-2 flex flex-col gap-6'>
			<div>
				<p className='mb-2 text-xs font-bold uppercase tracking-[0.2em] text-orange-600'>
					Leave a little wisdom
				</p>
				<h2
					id={`${id}-title`}
					className='text-3xl font-black tracking-tight text-slate-950'
				>
					{title}
				</h2>
			</div>
			<form
				id={id}
				aria-labelledby={`${id}-title`}
				onSubmit={handleFormSubmit}
				autoComplete='off'
				className='flex max-w-2xl flex-col gap-6 rounded-2xl border border-orange-100 bg-white p-6 shadow-[0_18px_50px_-24px_rgba(15,23,42,0.45)] sm:p-8'
			>
				{alert.show && (
					<Alert {...alert} removeAlert={onDismissAlert ?? (() => {})} />
				)}
				{children}
				<button
					type='submit'
					className='rounded-lg bg-sky-900 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-sky-900/20 transition hover:-translate-y-0.5 hover:bg-sky-800 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2'
				>
					Submit
				</button>
			</form>
		</div>
	)
}

export default Form
