const connection = require("../database/connection")

exports.createUser = (req, res) => {
    const {nome, email, senha } = req.body

    const sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

    connection.query(sql, [nome, email, senha], (err, result) => {
        if(err) {
            console.error(err);
            res.status(500).send("Erro ao cadastrar usuário")
        }else {
            res.status(201).send("Usuário cadastrado com sucesso")
        }
    })
}