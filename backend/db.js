const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'geethika_potha'
});

db.connect((e) => {
    if(e){
        console.error('Error of the connected with database : ' , e);
        return;
    }
    console.log('Connected with Database successfuly');
});

module.exports = db;