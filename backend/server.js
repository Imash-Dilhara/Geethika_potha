const express = require('express');
const router = express.Router();
const db = require('./db');

router.post('/register' , async(req,res) => {
    const {fname,lname,email,pass} = req.body;

    if(!fname || !email || !pass){
        return res.status(400).json({error : "Requierd all information."});
    }

    const query = "INSERT INTO register (fname , lname , email , password) VALUE (? , ? , ? ,?)";

    db.query(query , [fname , lname , email, pass] , (e,result) => {
        if(e){
            console.error(e);
            return res.status(500).json({error:"Some errors are from register"});
        }
        res.status(201).json({
            message: "User successfuly registered",
            userId: result.insertId
        });
    });
});

module.exports = router;