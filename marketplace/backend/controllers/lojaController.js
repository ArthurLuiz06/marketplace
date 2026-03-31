exports.createLoja = (req, res) => {

  const connection = require("../database/connection");

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

  const id_usuario = req.user.id;

  console.log("BODY:", req.body);

  // ✅ VALIDAÇÃO BÁSICA
  if (!nome_loja || !descricao || !rua || !cidade || !estado || !cep) {
    return res.status(400).json({
      erro: "Preencha todos os campos obrigatórios"
    });
  }

  // 🔒 1. VERIFICAR SE JÁ TEM LOJA
  const sqlVerificar = `
    SELECT id_loja FROM lojas WHERE id_usuario = ?
  `;

  connection.query(sqlVerificar, [id_usuario], (err, result) => {
    if (err) {
      console.log("ERRO VERIFICAÇÃO:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    if (result.length > 0) {
      return res.status(400).json({
        erro: "Você já possui uma loja"
      });
    }

    // 🏪 2. CRIAR LOJA
    const sqlLoja = `
      INSERT INTO lojas (nome_loja, descricao, id_usuario)
      VALUES (?, ?, ?)
    `;

    connection.query(sqlLoja, [nome_loja, descricao, id_usuario], (err, result) => {
      if (err) {
        console.log("ERRO LOJA:", err);

        // 🔥 TRATAMENTO DO UNIQUE (caso banco bloqueie)
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            erro: "Usuário já possui uma loja"
          });
        }

        return res.status(500).json({ erro: "Erro ao criar loja" });
      }

      const id_loja = result.insertId;

      console.log("ID LOJA:", id_loja);

      // 📍 3. CRIAR ENDEREÇO
      const sqlEndereco = `
        INSERT INTO endereco_loja
        (id_loja, rua, numero, bairro, cidade, estado, cep)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const valoresEndereco = [
        id_loja,
        rua,
        numero || null,
        bairro,
        cidade,
        estado,
        cep
      ];

      console.log("ENDEREÇO:", valoresEndereco);

      connection.query(sqlEndereco, valoresEndereco, (err2) => {
        if (err2) {
          console.log("ERRO ENDEREÇO:", err2);

          // ⚠️ rollback manual simples (boa prática)
          connection.query(
            "DELETE FROM lojas WHERE id_loja = ?",
            [id_loja]
          );

          return res.status(500).json({
            erro: "Erro ao salvar endereço da loja"
          });
        }

        console.log("LOJA + ENDEREÇO SALVOS!");

        return res.status(201).json({
          mensagem: "Loja criada com sucesso!"
        });
      });
    });
  });
};