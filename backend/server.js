const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const app = express();
const db = require('./db');

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());

//Multer strp for PDF file
const storage = multer.diskStorage({
    destination: (req, file , cd) => {
        cd(null, 'uploads/');
    },
    filename : (req , file , cd) => {
        cd(null , Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({storage : storage});

//Token verify middleware
const veryfyToken = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({
            success : false,
            message: 'Access denied! No token provided.'
        });
    }

    jwt.verify(token,'Ids_1225',(e,user) => {
        if(e){
            return res.status(403).json({
                success : false,
                message : 'Invalid or expire token!'
            });
        }
        req.user = user;
        next();
    });
};

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

        const token = jwt.sign({
            id: result.insertId , 
            email
        } , 'Ids_1225' , {expiresIn: '2h'});

        res.status(201).json({
            message: "User successfully registered",
            token,
            user: {
                id: result.insertId,
                name: fname,
                email
            }
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

        //Remove after the test
        console.log("User : " , user);

        const isPasswordMatch = (password === user.password);

        if(!isPasswordMatch){
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const token = jwt.sign({
            id: user.r_no,
            email: user.email
        } , 'Ids_1225' , {expiresIn: '2h'});

        res.status(200).json({
            success: true,
            message: 'Login successful!',
            token,
            user:{id:user.r_no , name:user.fname, email:user.email}
        });
    });
});

//Add Hymn
app.post('/api/addhymn' ,veryfyToken,upload.single('pdf'),(req,res) => {
    const {title , firstName , lastName} = req.body;
    const userId = req.user.id;
    const pdfFile = req.file ?req.file.filename : null ;
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const day = String(date.getDate()).padStart(2,'0');
    const nowDate = `${year}-${month}-${day}`;

    if(!title || !pdfFile){
        return res.status(400).json({
            success:false,
            message:'Title and PDF file are required!'
        });
    }

    const query = "INSERT INTO hymns (r_no , title , pdf , singerFname , singerLname , added_date) VALUES (?,?,?,?,?,?)";

    db.query(query , [userId , title , pdfFile , firstName , lastName , nowDate] , (e,result) => {
        if(e){
            console.error(e);
            return res.status(500).json({
                success:false,
                message:'Database error while adding hymn!'
            });
        }

        res.status(201).json({
            success:true,
            message:'Hymn added successfully!',
            hymnId: result.insertId
        });
    });
});

app.listen(5000 , () => {
    console.log("Server is running");
});