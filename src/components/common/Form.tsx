import { FormEvent, ReactNode } from 'react'
import Alert from '../../partials/Alert'
import { AlertState } from '../../types/AlertType'

interface FormProps<T extends HTMLFormElement = HTMLFormElement> {
  onSubmit: (e: FormEvent<T>) => void | Promise<void>
  alert: AlertState
  children: ReactNode
  id: string
  title: string
}

function Form<T extends HTMLFormElement = HTMLFormElement>({ 
  onSubmit, 
  alert, 
  children, 
  id, 
  title 
}: FormProps<T>) {
  return (
    <>
      <h2>{title}</h2>
      <form id={id} onSubmit={onSubmit} autoComplete="off">
        {alert.show && <Alert {...alert} removeAlert={() => {}} />}
        {children}
        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default Form
