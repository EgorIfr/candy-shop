import express from 'express';
import mysql from 'mysql2';
const router = express.Router();
const app = express();
const PORT = 3306;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'candy-shop',
})

app.listen(PORT, () => {
    console.log(`Server started on port http://localhost:${PORT}`);
})