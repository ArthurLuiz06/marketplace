const db = require("../database/connection")

exports.criarLoja = async (req, res) => {
    const {nome_loja, descricao, endereco} = req.body
    const id_usuario = req.user.id;

    if(!nome_loja) {
        return res.status(500).json({error: "Nome da loja é obrigatorio!"})
    }

    try {
        //Criar loja
        const[lojaResult] = await db.query(
            `INSERT INTO lojas (id_usuario, nome_loja, descricao) VALUES (?, ?, ?)`,
            [id_usuario, nome_loja, descricao]
        );

        const id_loja = lojaResult.insertId

        //Criar endereço loja
        await db.query(
            `INSERT INTO endereco_loja
            (id_loja, rua, numero, bairro, cidade, estado, cep)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                id_loja,
                endereco.rua,
                endereco.numero,
                endereco.bairro,
                endereco.cidade,
                endereco.estado,
                endereco.cep
            ]
        );

        // Atualiza usuário como vendedor
        await db.query(
            `UPDATE usuarios SET is_vendedor = TRUE WHERE id_usuario = ?`,
            [id_usuario]
        );

        res.status(201).json({mensagem: "Loja criada com sucesso"});

    }catch(error) {
        res.status(500).json({error: error.message})
    }
}
