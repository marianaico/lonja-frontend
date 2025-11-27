/* eslint-disable react-hooks/immutability */
/* eslint-disable no-unused-vars */
import { useForm } from 'react-hook-form';
import client from '../api/client';

export default function Login() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (values) => {
    try {
      const { data } = await client.post('/auth/login', values);
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } catch (e) {
      alert('Credenciales inválidas');
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 400 }}>
      <h3>Ingreso</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input className="form-control" {...register('email')} />
        </div>
        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input type="password" className="form-control" {...register('password')} />
        </div>
        <button className="btn btn-primary w-100" type="submit">Entrar</button>
      </form>
    </div>
  );
}

