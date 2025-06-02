import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Registro = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('usuario'); // ← nuevo
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (contrasena !== confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/api/usuario/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: usuario, clave: contrasena, tipoUsuario }), // ← añade tipoUsuario
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/');
      } else {
        setError(data.error || 'Error al registrar usuario');
      }
    } catch (error) {
      setError('Error de conexión con el servidor');
    }
  };

  return (
    <div className="login-container">
      <h2>Formulario de Registro</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmarContrasena}
          onChange={(e) => setConfirmarContrasena(e.target.value)}
          required
        />
        <select
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value)}
          required
        >
          <option value="usuario">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Registrar</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => navigate('/')}>Volver al inicio</button>
    </div>
  );
};

export default Registro;







