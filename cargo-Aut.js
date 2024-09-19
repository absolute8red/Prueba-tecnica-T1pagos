const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Lee el token de autorización desde el archivo .txt
const tokenPath = path.join(__dirname, 'token.txt');
let token;

try {
  // Leer el contenido del archivo y quitar saltos de línea o espacios en blanco
  token = fs.readFileSync(tokenPath, 'utf-8').trim();
} catch (error) {
  console.error('Error al leer el archivo de token:', error.message);
  process.exit(1); // Terminar la ejecución si no se puede leer el token
}

// Datos del cargo autorizado
const cargoData = {
  "monto": "100.00",
  "pais": "MEX",
  "moneda": "MXN",
  "descripcion": "Descripción del cargo",
  "capturar": true,
  "incluir_riesgo": true,
  "uso_antifraude": true,
  "metodo_pago": "tarjeta",
  "tarjeta": {
    "token": "9d0b5d41-9d55-4d56-89bc-eb54931c0d49" // Reemplaza con el token real de la tarjeta
  },
 
};

// Define la URL de la API para el cargo autorizado
const url = 'https://api.sandbox.claropagos.com/v1/cargo';

// Realiza la solicitud POST para el cargo autorizado
axios.post(url, cargoData, {
  headers: {
    'Authorization': `Bearer ${token}`,  // Usa el token leído desde el archivo .txt
    'Content-Type': 'application/json'   // Asegúrate de enviar JSON
  }
})
.then(response => {
  const logMessage = `Cargo autorizado con éxito:\nRespuesta: ${JSON.stringify(response.data.data.cargo.id, null, 2)}\n\n`;
  console.log(logMessage);  // También imprimir en consola

  // Escribir el log en un archivo separado
  fs.appendFile('Id de cargo.txt', logMessage, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo log_cargo_autorizado.txt:', err);
    } else {
      console.log('Respuesta registrada en log_cargo_autorizado.txt');
    }
  });
})
.catch(error => {
  const errorMessage = `Error al realizar el cargo autorizado:\n${error.response ? JSON.stringify(error.response.data, null, 2) : error.message}\n\n`;
  console.error(errorMessage);  // También imprimir en consola

  // Escribir el error en el archivo de log
  fs.appendFile('error.txt', errorMessage, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo log_cargo_autorizado.txt:', err);
    } else {
      console.log('Error registrado en log_cargo_autorizado.txt');
    }
  });
});
