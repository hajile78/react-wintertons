import Form from './common/Form'

interface LoginViewProps {
  alert: { show: boolean; type: string; message: string }
  onSubmit: (email: string, password: string) => void
  onDismissAlert: () => void
}

export default function LoginView({ alert, onSubmit, onDismissAlert }: LoginViewProps) {
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value
    const password = (form.elements.namedItem('password') as HTMLInputElement).value
    onSubmit(email, password)
    form.reset()
  }

  return (
    <>
        <Form
        id="loginForm"
        title="Login"
        onSubmit={handleFormSubmit}
        alert={alert}
        onDismissAlert={onDismissAlert}
        >
        <fieldset className='flex flex-col gap-4'>
            <label htmlFor="email">Email</label>
            <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            className='border rounded-sm border-gray-400'
            />
            <label htmlFor="password">Password</label>
            <input
            type="password"
            id="password"
            name="password"
            required
            autoComplete="current-password"
            className='border rounded-sm border-gray-400'
            />
        </fieldset>
        </Form>
    </>
  )
}
