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

// Configuración común para la solicitud de la API
const url = 'https://api.sandbox.claropagos.com/v1/tarjeta';
const headers = {
  'Authorization': `Bearer ${token}`,  // Usa el token leído desde el archivo .txt
  'Content-Type': 'application/json'   // Asegúrate de enviar JSON
};

// Función para crear una tarjeta y escribir en un log separado
const crearTarjeta = (data, logFileName) => {
  axios.post(url, data, { headers })
    .then(response => {
      const logMessage = `Tarjeta creada con éxito: ${data.numero_tarjeta}\nRespuesta: ${JSON.stringify(response.data.data.tarjeta.token, null, 2)}\n\n`;
      console.log(logMessage);  // También imprimir en consola

      // Escribir el log en un archivo separado
      fs.appendFile(logFileName, logMessage, (err) => {
        if (err) {
          console.error(`Error al escribir en el archivo ${logFileName}:`, err);
        } else {
          console.log(`Respuesta registrada en ${logFileName}`);
        }
      });
    })
    .catch(error => {
      const errorMessage = `Error al crear la tarjeta ${data.numero_tarjeta}:\n${error.response ? JSON.stringify(error.response.data, null, 2) : error.message}\n\n`;
      console.error(errorMessage);  // También imprimir en consola

      // Escribir el error en el archivo de log
      fs.appendFile(logFileName, errorMessage, (err) => {
        if (err) {
          console.error(`Error al escribir en el archivo ${logFileName}:`, err);
        } else {
          console.log(`Error registrado en ${logFileName}`);
        }
      });
    });
};

// Datos de la primera tarjeta
const tarjeta1 = {
  "pan": "4111111111111111",
  "nombre": "Juan Perez",
  "cvv2":"058",
  "expiracion_mes": "12",
  "expiracion_anio":"25"
};

// Datos de la segunda tarjeta
const tarjeta2 = {
  "pan": "4222222222222220",
  "nombre": "Maria Elena",
  "cvv2":"058",
  "expiracion_mes": "12",
  "expiracion_anio":"25"
};

// Crear la primera tarjeta y guardar el log en 'log_tarjeta1.txt'
crearTarjeta(tarjeta1, 'Tarjeta Autorizada.txt');

// Crear la segunda tarjeta y guardar el log en 'log_tarjeta2.txt'
crearTarjeta(tarjeta2, 'Tarjeta rechazada.txt');
