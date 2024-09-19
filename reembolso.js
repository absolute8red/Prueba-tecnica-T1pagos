const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Lee el token de autorización desde el archivo Token_Autorizacion.txt
const tokenPath = path.join(__dirname, 'Token_Autorizacion.txt');

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

// Define la URL de la API de T1Pagos para realizar un reembolso
const apiUrl = 'https://api.sandbox.claropagos.com/v1/cargo/{cargo_id}/reembolsar'; // Aqui solo cambiamos el los corchetes

// Datos del reembolso
const datosReembolso = {
  monto: 100,
  orden_id: 'string', 
  cliente_id: 'string' 
};

// Función para realizar el reembolso
const reembolsar = async () => {
  try {
    const token = await leerToken();
    const response = await axios.post(apiUrl, datosReembolso, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    console.log('Respuesta de la API:', response.data.rembolso.estatus);
  } catch (error) {
    console.error('Error al realizar el reembolso:', error.response ? error.response.data : error.message);
  }
};

// Ejecuta la función
reembolsar();
