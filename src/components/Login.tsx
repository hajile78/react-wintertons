import { useState, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Form from './common/Form';

function Login() {
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    try {
      await auth.login({
        username: form.username.value,
        password: form.password.value,
      });
      setAlert({ show: true, type: 'success', message: 'Login successful!' });
      navigate(from, { replace: true });
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Invalid username or password',
      });
    }
  };

  return (
    <Form
      id="loginForm"
      title="Login"
      onSubmit={handleSubmit}
      alert={alert}
    >
      <fieldset>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          required
          autoComplete="username"
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          required
          autoComplete="current-password"
        />
      </fieldset>
    </Form>
  );
}

export default Login;
