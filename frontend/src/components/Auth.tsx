import React, { useState } from 'react';
import './Auth.css';
import { login, register } from '../utils/api';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      if (isLogin) {
        const response = await login(username, password);
        localStorage.setItem('authToken', response.access);
        onLogin();
      } else {
        await register(username, password);
        // Auto-login after registration
        const response = await login(username, password);
        localStorage.setItem('authToken', response.access);
        onLogin();
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.response?.status === 400) {
        setError('Nombre de usuario o contraseña inválidos');
      } else if (err.response?.status === 401) {
        setError('Credenciales incorrectas');
      } else {
        setError('Error de conexión. Por favor intente nuevamente.');
      }
    }
  };

  const handleReset = () => {
    setUsername('');
    setPassword('');
    setError('');
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit} onReset={handleReset}>
        <h2>
          <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </h2>
        
        {error && (
          <div className="error-message" role="alert" aria-live="assertive">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}
        
        <div className="input-group">
          <label htmlFor="username">Nombre de Usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn-primary">
          <i className={`fas ${isLogin ? 'fa-sign-in-alt' : 'fa-user-plus'}`}></i>
          {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
        </button>
        
        <div className="toggle-auth">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
            {isLogin ? 'Regístrate' : 'Inicia Sesión'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Auth;
