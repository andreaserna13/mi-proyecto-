// backend/index.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware para permitir JSON y CORS
app.use(express.json());
app.use(cors());

// Ruta POST para login
app.post('/api/auth/login', (req, res) => {
  const { nombre, clave, tipoUsuario } = req.body;

  // Validación para administrador
  if (nombre === 'Andrea Serna Gil' && clave === '123456simon' && tipoUsuario === 'admin') {
    return res.json({
      exito: true,
      token: 'token-falso-admin',
      usuario: { tipoUsuario: 'admin', nombre },
      mensaje: 'Login exitoso como administrador',
    });
  }

 // Validación para usuario
if (nombre === 'Julian Zapata' && clave === 'julian.1009' && tipoUsuario === 'usuario') {
  return res.json({
    exito: true,
    token: 'token-falso-usuario',
    usuario: { tipoUsuario: 'usuario', nombre },
    mensaje: 'Login exitoso como usuario',
  });
}


  // Si ninguna coincidencia
  res.status(401).json({
    exito: false,
    mensaje: 'Credenciales incorrectas',
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
