const express = require('express');
const cors = require('cors'); // Importamos cors
const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

const app = express();

// ✅ Configuración de CORS
app.use(cors({
  origin: 'http://localhost:5173', // Reemplaza si tu frontend está en otro puerto
  credentials: true,
}));

// Middleware para recibir JSON
app.use(express.json());

// Conexión a la base de datos
const sequelize = new Sequelize('gestion', 'root', '123456simon', {
  host: 'localhost',
  dialect: 'mysql',
});

// Definición del modelo Usuario
const Usuario = sequelize.define('usuarios', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  estado: {
    type: DataTypes.TINYINT,
    defaultValue: 1,
  },
  dateCreated: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
}, {
  freezeTableName: true,
  timestamps: false,
});

// Ruta para iniciar sesión
app.post('/api/usuario/iniciar-sesion', async (req, res) => {
  const { nombre, contraseña } = req.body;

  if (!nombre || !contraseña) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  try {
    const usuario = await Usuario.findOne({ where: { nombre } });

    if (!usuario) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!match) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    if (usuario.estado !== 1) {
      return res.status(403).json({ mensaje: 'Usuario inactivo' });
    }

    res.json({ mensaje: 'Inicio de sesión exitoso', usuario: { nombre: usuario.nombre } });

  } catch (error) {
    console.error('Error en /api/usuario/iniciar-sesion:', error);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
  }
});

// ✅ Función para actualizar la contraseña de un usuario
async function actualizarPassword(nombreUsuario, nuevaPassword) {
  try {
    await sequelize.authenticate();
    console.log('Conectado a MySQL');

    const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

    const resultado = await Usuario.update(
      { contraseña: hashedPassword },
      { where: { nombre: nombreUsuario } }
    );

    if (resultado[0] === 0) {
      console.log('No se encontró el usuario para actualizar');
    } else {
      console.log('Contraseña actualizada correctamente');
    }
  } catch (error) {
    console.error('Error actualizando la contraseña:', error);
  }
}

// ✅ Función temporal para crear un nuevo usuario
async function crearNuevoUsuario(nombreUsuario, clavePlano) {
  try {
    await sequelize.authenticate(); // Asegura conexión

    const hashedPassword = await bcrypt.hash(clavePlano, 10);

    await Usuario.create({
      nombre: nombreUsuario,
      contraseña: hashedPassword,
      estado: 1, // activo por defecto
    });

    console.log(`✅ Usuario "${nombreUsuario}" creado correctamente`);
  } catch (error) {
    console.error('❌ Error al crear el usuario:', error);
  }
}

// ✅ Iniciar servidor y sincronizar modelo
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('Conectado a MySQL');

    await Usuario.sync();
    console.log('Modelo Usuario sincronizado');

    const PORT = 3001;
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
  }
}

// ✅ Ejecutar creación de nuevo usuario (usa solo 1 vez y luego comenta)
crearNuevoUsuario('Julian Zapata', 'julian.1009'); // 👈 Modifica estos valores según necesites

// ✅ Iniciar servidor
startServer();
