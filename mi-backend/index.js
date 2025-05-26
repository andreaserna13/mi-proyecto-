const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); // Para que el frontend pueda hacer peticiones sin problema
app.use(express.json());

app.post('/api/auth/login', (req, res) => {
  const { usuario, clave, tipoUsuario } = req.body;

  // Validación muy simple solo para ejemplo
  if (usuario === 'Andrea Serna Gil' && clave === '123456simon' && tipoUsuario === 'admin') {
    return res.json({ exito: true, mensaje: 'Login correcto' });
  }
  if (usuario === 'Julian Zapata' && clave === 'julian.1009' && tipoUsuario === 'usuario') {
    return res.json({ exito: true, mensaje: 'Login correcto' });
  }
  return res.status(401).json({ exito: false, mensaje: 'Usuario o clave incorrectos' });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});




