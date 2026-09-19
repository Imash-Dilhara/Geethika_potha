const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));


//Register
app.use(express.json());

app.post('/api/register', async (req, res) => {
    const { fname, lname, email, password } = req.body;

    if (!fname || !email || !password) {
        return res.status(400).json({ error: "Required all information." });
    }

    const query = "INSERT INTO register (fname, lname, email, password) VALUES (?, ?, ?, ?)";

    db.query(query, [fname, lname, email, password], (e, result) => {
        if (e) {
            console.error(e);
            return res.status(500).json({ error: "Some errors are from register" });
        }
        res.status(201).json({
            message: "User successfully registered",
            userId: result.insertId
        });
    });
});

