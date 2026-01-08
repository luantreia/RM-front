import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/api';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await api.auth.register({ email, password });
      if (data.error) throw new Error(data.error);
      login(data.usuario, data.token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card bg-white p-8 md:p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-semibold text-gray-900 mb-2 tracking-tight">Crear tu cuenta</h2>
          <p className="text-[#5f6368]">Empezá a registrar tu fuerza hoy</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Correo electrónico</label>
            <input 
              type="email" 
              className="input-field"
              placeholder="tu@correo.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input 
              type="password" 
              className="input-field"
              placeholder="Mínimo 6 caracteres"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3 mt-4">
            Crear cuenta
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-[#5f6368]">
            ¿Ya tenés cuenta? <Link to="/login" className="text-[#1a73e8] font-medium hover:underline">Iniciá sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
