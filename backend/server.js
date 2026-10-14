const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const app = express();
const db = require('./db');
const emailRoutes = require('./routes/emailRoutes');

app.set('trust proxy' , 1);

//=========Test case ============
app.get('/api/test', (req, res) => {
  res.json({ message: "Backend is working!" });
});
//============================

const allowedOrigins = [
  'http://localhost:5173',
  'https://hymnflow.vercel.app'
];

//CORS 
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use('/uploads' , express.static(path.join(__dirname , 'uploads')));

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

//Get Hymns
app.get('/api/getallhymns' ,(req,res) => { 
    const query = "SELECT * FROM hymns ORDER BY title ASC";

    db.query(query , (e,result) => {
        if(e){
            console.error("Error fetching hymns : ",e);
            return res.status(500).json({error : "Database error!"});
        }

        const baseURL = `${req.protocol}://${req.get('host')}`;

        const hymnWithPDFURL = result.map(hymn => ({
            ...hymn,
            pdfURL: hymn.pdf ? `${baseURL}/uploads/${hymn.pdf}` : null
        }));

        res.json(hymnWithPDFURL);
    });
});

//Check email
app.post('/api/allemail' , (req,res) => {

    const { email } = req.body;

    const query = "SELECT * FROM register WHERE email = ?";

    db.query(query, [email] , (e,result) => {
        if(e){
            console.error("Error fetching hymns : ",e);
            return res.status(500).json({error : "Database error!"});
        }

        if(result.length === 0){
            return res.status(200).json(false);
        }
        res.status(200).json(true);
    });
});

//Search Hymn
app.get('/api/searchhymns' , (req,res) => {
    const {search} = req.query;

    if(!search){
        return res.status(400).json({error : "Search term is reqiured!"});
    }

    const query = "SELECT * FROM hymns WHERE title LIKE ? ORDER BY  title ASC";
    const searchTerm  = `%${search}%`;

    db.query(query , [searchTerm] , (e,result) => {
        if(e){
            console.error("Error searching hymn : " , e);
            return res.status(500).json({error: 'Database Error!'});
        }

        const baseURL = `${req.protocol}://${req.get('host')}`;
        const hymnWithPDFURL = result.map(hymn => ({
            ...hymn,
            pdfURL: hymn.pdf ? `${baseURL}/uploads/${hymn.pdf}` : null
        }));

        res.json(hymnWithPDFURL);
    });
});

app.use('/api' , emailRoutes);

//Change password
app.post('/api/change-password' , (req,res) => {
    const { id , newPassword } = req.body;

    if(!id || !newPassword){
        return res.status(400).json({success: false , message:"Canot found user or password required."});
    }

    try{
        const query = 'UPDATE register SET password = ? WHERE r_no = ?';
        db.query(query , [newPassword , id] , (err , result) => {
            if(err){
                console.error("Can't change password : ", err);
                return res.status(500).json({success: false , message: "Can't change the password, Database error!"});
            }

            if(result.length === 0){
                return res.status(404).json({success:false , message:"User not found! Try again."});
            }

            return res.status(200).json({success: true , message: "Password change successfully!"});
        });
    }catch(e){
        return res.status(500).json({success:false , message: "Password change database error!"});
    }
});

app.listen(5000 , () => {
    console.log("Server is running");
});