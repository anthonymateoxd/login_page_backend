import app from './app.js';
import { getConnection } from './connection/connection.js';

getConnection();
app.listen(4000);
console.log('Escuchando en el puerto', 4000);
