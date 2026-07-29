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
  title 
}: FormProps<T>) {
  const handleFormSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    onSubmit(e as FormEvent<T>)
  }

  return (
    <div className="col-span-2 flex flex-col gap-6">
      <h2 id={`${id}-title`}>{title}</h2>
      <form
        id={id}
        aria-labelledby={`${id}-title`}
        onSubmit={handleFormSubmit}
        autoComplete="off"
        className="flex flex-col gap-6 max-w-md"
      >
        {alert.show && (
          <Alert
            {...alert}
            removeAlert={onDismissAlert ?? (() => {})}
          />
        )}
        {children}
        <button type="submit" className='border rounded-md border-gray-400'>Submit</button>
      </form>
    </div>
  )
}

export default Form
