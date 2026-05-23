import { useEffect } from 'react'

type Props = {
  type: string,
  message: string,
  removeAlert: () => void,
}

const Alert = ({ type, message, removeAlert }: Props) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeAlert()
    }, 2500)
    return () => clearTimeout(timeout)
  }, [removeAlert])

  return <p className={`alert alert-${type}`}>{message}</p>
}

export default Alert
