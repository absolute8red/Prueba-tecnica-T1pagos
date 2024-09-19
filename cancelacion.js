const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Lee el token de autorización desde el archivo Token_Autorizacion.txt
const tokenPath = path.join(__dirname, 'token.txt');

const leerToken = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(tokenPath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      resolve(data.trim());
    });
  });
};

// Define la URL de la API de T1Pagos para cancelar un cargo
const apiUrl = 'https://api.sandbox.claropagos.com/v1/cargo/fe81c6cb-cc60-4f4f-ab5e-3ce6421c917e/cancelar'; // Asegúrate de reemplazar esta URL con la correcta

// Datos del cargo a cancelar
const datosCargo = {
  monto: 100,
  orden_id: 'string', // Reemplaza con el ID del cargo que quieres cancelar
  cliente_id: 'string' // Reemplaza con el ID del cliente asociado
};

// Función para cancelar el cargo
const cancelarCargo = async () => {
  try {
    const token = await leerToken();
    const response = await axios.post(apiUrl, datosCargo, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Respuesta de la API:', response.data.data.cancelacion.estatus);
  } catch (error) {
    console.error('Error al cancelar el cargo:', error.response ? error.response.data : error.message);
  }
};

// Ejecuta la función
cancelarCargo();
