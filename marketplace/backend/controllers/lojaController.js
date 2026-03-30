const connection = require("../database/connection");


// 🏪 CRIAR LOJA
exports.createLoja = (req, res) => {
  const { nome_loja, descricao, endereco } = req.body;
  const id_usuario = req.user.id;

  const sqlLoja = `
    INSERT INTO lojas (nome_loja, descricao, id_usuario)
    VALUES (?, ?, ?)
  `;

  connection.query(sqlLoja, [nome_loja, descricao, id_usuario], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ erro: "Erro ao criar loja" });
    }

    const id_loja = result.insertId;

    const sqlEndereco = `
      INSERT INTO endereco_loja
      (id_loja, rua, numero, bairro, cidade, estado, cep)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      sqlEndereco,
      [
        id_loja,
        endereco.rua,
        endereco.numero || null,
        endereco.bairro,
        endereco.cidade,
        endereco.estado,
        endereco.cep
      ],
      (err2) => {
        if (err2) {
          console.log(err2);
          return res.status(500).json({ erro: "Erro ao salvar endereço da loja" });
        }

        return res.status(201).json({
          mensagem: "Loja criada com sucesso!"
        });
      }
    );
  });
};



// 🏪 BUSCAR LOJA DO USUÁRIO
exports.getMinhaLoja = (req, res) => {
  const id_usuario = req.user.id;

  const sql = `
    SELECT l.id_loja, l.nome_loja, l.descricao,
           e.rua, e.numero, e.bairro, e.cidade, e.estado, e.cep
    FROM lojas l
    LEFT JOIN endereco_loja e ON l.id_loja = e.id_loja
    WHERE l.id_usuario = ?
  `;

  connection.query(sql, [id_usuario], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    if (result.length === 0) {
      return res.status(404).json({ erro: "Usuário não possui loja" });
    }

    return res.json({ loja: result[0] });
  });
};



// 🏪 ATUALIZAR LOJA
exports.updateLoja = (req, res) => {
  const id_usuario = req.user.id;

  const {
    nome_loja,
    descricao,
    rua,
    numero,
    bairro,
    cidade,
    estado,
    cep
  } = req.body;

  const sqlLoja = `
    UPDATE lojas
    SET nome_loja = ?, descricao = ?
    WHERE id_usuario = ?
  `;

  connection.query(sqlLoja, [nome_loja, descricao, id_usuario], (err) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ erro: "Erro ao atualizar loja" });
    }

    const sqlEndereco = `
      UPDATE endereco_loja el
      JOIN lojas l ON el.id_loja = l.id_loja
      SET el.rua = ?, el.numero = ?, el.bairro = ?, el.cidade = ?, el.estado = ?, el.cep = ?
      WHERE l.id_usuario = ?
    `;

    connection.query(
      sqlEndereco,
      [rua, numero, bairro, cidade, estado, cep, id_usuario],
      (err2, result) => {
        if (err2) {
          console.log(err2);
          return res.status(500).json({ erro: "Erro ao atualizar endereço" });
        }

        return res.json({ mensagem: "Loja atualizada com sucesso!" });
      }
    );
  });
};