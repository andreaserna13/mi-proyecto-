import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';  // <-- Solo agregué Link aquí
import { iniciarSesion } from '../service/useService';
import './LoginAdmin.css';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Login = ({ logueado, tipoUsuario, setLogueado, setTipoUsuario }) => {
  const [nombre, setNombre] = useState('');
  const [clave, setClave] = useState('');
  const [tipoUsuarioState, setTipoUsuarioState] = useState('');
  const [error, setError] = useState('');
  const [mostrarClave, setMostrarClave] = useState(false);
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!nombre || !clave || !tipoUsuarioState) {
      setError('Por favor completa todos los campos');
      return;
    }

    setCargando(true);
    try {
      const resultado = await iniciarSesion(nombre, clave, tipoUsuarioState);

      if (resultado.exito) {
        if (resultado.token) localStorage.setItem('token', resultado.token);
        setLogueado(true);
        setTipoUsuario(resultado.usuario.tipoUsuario);
        setError('');
        // Navegación inmediata después de login exitoso
        if (resultado.usuario.tipoUsuario === 'admin') {
          navigate('/admin');
        } else {
          navigate('/reservas');
        }
      } else {
        setError(resultado.mensaje || 'Credenciales incorrectas');
      }
    } catch {
      setError('Error al iniciar sesión. Inténtalo de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (logueado) {
      if (tipoUsuario === 'admin') {
        navigate('/admin');
      } else {
        navigate('/reservas');
      }
    }
  }, [logueado, tipoUsuario, navigate]);

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Nombre de usuario</label>
            <input
              id="username"
              type="text"
              placeholder="Nombre de usuario"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Contraseña</label>
            <div className="password-container">
              <input
                id="password"
                type={mostrarClave ? 'text' : 'password'}
                placeholder="Contraseña"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setMostrarClave(!mostrarClave)}
                title={mostrarClave ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') setMostrarClave(!mostrarClave);
                }}
              >
                {mostrarClave ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="userType">Tipo de Usuario</label>
            <select
              id="userType"
              value={tipoUsuarioState}
              onChange={(e) => setTipoUsuarioState(e.target.value)}
              required
            >
              <option value="" disabled>Tipo de Usuario</option>
              <option value="admin">Administrador</option>
              <option value="usuario">Usuario</option>
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" disabled={cargando}>
            {cargando ? 'Cargando...' : 'Entrar'}
          </button>
        </form>

        <div className="links">
          <Link to="/recuperar-contraseña">¿Olvidaste tu contraseña?</Link>
          <Link to="/registro">¿No tienes cuenta? Regístrate</Link>
          <Link to="/permisos">Formulario de permisos</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;























