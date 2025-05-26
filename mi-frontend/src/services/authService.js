const API_URL = 'http://localhost:3000/api/auth/login';


export const login = async (usuario, clave, tipoUsuario) => {
  const response = await fetch(`${API_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ usuario, clave, tipoUsuario }),
  });

  if (!response.ok) {
    throw new Error('Error en el login');
  }

  return response.json(); // token o usuario
};
