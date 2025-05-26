const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const respuesta = await login(usuario, clave, tipoUsuario); // llamada al backend
    console.log('Login exitoso:', respuesta);

    setLogueado(true);
    setTipoUsuario(tipoUsuario);

    if (tipoUsuario === 'admin') {
      navigate('/admin');
    } else {
      navigate('/reservas');
    }
  } catch (error) {
    console.error(error);
    setError('Credenciales inválidas o error del servidor');
  }
};

