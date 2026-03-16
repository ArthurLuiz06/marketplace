/* eslint-disable no-undef */

const mysql = require("mysql2");

const connection = mysql.createConnection({

    host:"localhost",
    user: "root",
    password: "",
    database: "marketplace"
});

connection.connect((err) => {
    if(err) {
        console.error('Erro ao conectar com o banco', err)
    } else {
        console.error('Conectado ao banco')
    }
});


module.exports = connection
