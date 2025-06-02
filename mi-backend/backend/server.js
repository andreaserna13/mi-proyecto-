require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.post('/api/auth/recuperar-contrasena', async (req, res) => {
  const { correo } = req.body;

  if (!correo) {
    return res.status(400).json({ mensaje: 'El correo es obligatorio' });
  }

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.CORREO_APP,
      pass: process.env.CORREO_CLAVE,
    },
  });

  const mailOptions = {
    from: process.env.CORREO_APP,
    to: correo,
    subject: 'Recuperación de contraseña',
    text: 'Haz clic en este enlace para recuperar tu contraseña: http://tuapp.com/recuperar',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Correo enviado:', info.response);
    res.json({ mensaje: 'Correo enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ mensaje: 'Error al enviar el correo' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
});
