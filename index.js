const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// Configuración del servidor
const app = express();
const PORT = 3000;
const corsOptions = {
  origin: '*', // Permitir todos los orígenes
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};

if (process.env.NODE_ENV === 'production') {
  console.log('Estamos en modo producción');
} else {
  console.log('Estamos en modo desarrollo');
}
// Middleware
app.use(bodyParser.json());

app.use(cors(corsOptions));
// Conexión a MongoDB
mongoose.connect('mongodb://mongo:LeGfSDHrsFtQqMLwuDEzJlTXiBHUKyJT@mongodb.railway.internal:27017', {
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error al conectar a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
});

// Definición del esquema y modelo de invitados
const invitadoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  numAcompanantes: { type: Number, required: true },
});

const Invitado = mongoose.model('Invitado', invitadoSchema);

// Ruta para guardar un invitado
app.post('/api/invitados', async (req, res) => {
  try {
    const { nombre, numAcompanantes } = req.body;

    // Validación básica
    if (!nombre || numAcompanantes == null) {
      return res.status(400).json({ error: 'El nombre y numAcompanantes son requeridos' });
    }

    // Crear y guardar el invitado
    const nuevoInvitado = new Invitado({ nombre, numAcompanantes });
    await nuevoInvitado.save();

    res.status(201).json({ message: 'Invitado guardado exitosamente', invitado: nuevoInvitado });
  } catch (error) {
    console.error('Error al guardar el invitado:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Ruta para obtener todos los invitados
app.get('/api/invitados', async (req, res) => {
  try {
    const invitados = await Invitado.find(); // Consulta todos los documentos de la colección
    res.status(200).json(invitados);
  } catch (error) {
    console.error('Error al obtener los invitados:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`App running on port ${PORT} in ${process.env.NODE_ENV} mode.`);
});