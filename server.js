const mysql = require('mysql2');
const express = require('express');
const cors = require('cors');
const productoRoutes = require('./routes/producto.routes');
const authRoutes = require('./routes/auth.routes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/productos', productoRoutes);
app.use('/api/auth', authRoutes);

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
    host: '50.87.253.191', // Reemplace con el host correcto de Bluehost
    user: 'sistemo0_jordan',
    password: 'MYjorLG26',
    database: 'sistemo0_TiendaRenacer',
    port: 3306, // Asegúrese de que este es el puerto correcto
    connectTimeout: 10000 // Aumenta el tiempo de espera a 10 segundos
  });

connection.connect(error => {
  if (error) {
    console.error('Error conectando a la base de datos:', error);
    // No retornamos aquí para que el servidor siga funcionando incluso sin conexión a la BD
  } else {
    console.log('Conexión exitosa a la base de datos.');
  }
});

// Manejo de errores de conexión
connection.on('error', function(err) {
  console.log('Error de conexión de DB:', err);
  if(err.code === 'PROTOCOL_CONNECTION_LOST') {
    console.log('Conexión perdida. Reconectando...');
    handleDisconnect();
  } else {
    throw err;
  }
});

function handleDisconnect() {
  connection = mysql.createConnection(connection.config);
  
  connection.connect(function(err) {
    if(err) {
      console.log('Error al reconectar:', err);
      setTimeout(handleDisconnect, 2000);
    } else {
      console.log('Reconexión exitosa!');
    }
  });
}

// Rutas
app.use('/api/productos', productoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});