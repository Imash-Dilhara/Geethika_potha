const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./db');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

//Register
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

//Login
app.post('/api/login' , (req,res) => {
    const {email , password} = req.body;

    const sql = "SELECT * FROM register WHERE email = ?";
    db.query(sql , [email] , async(e ,result) => {
        if(e){
            return res.status(500).json({
                success:false,
                message:'Database Error!'
            });
        }

        if(result.length === 0){
            return res.status(401).json({
                success:false,
                message:'Invalid email or password!'
            });
        }

        const user = result[0];

        const isPasswordMatch = (password === user.password);

        if(!isPasswordMatch){
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            user:{id:user.id , name:user.fname, email:user.email}
        });
    });
});

app.listen(5000 , () => {
    console.log("Server is running");
});