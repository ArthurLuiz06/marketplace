const connection = require("../database/connection")

exports.createProduto = (req, res) => {

  const { nome_produto, descricao, preco, estoque, id_categoria } = req.body;
  const id_usuario = req.user.id;

  const imagem = req.file ? req.file.filename : null;

  // ✅ VALIDAÇÃO
  if (!nome_produto) {
    return res.status(400).json({ erro: "Nome do produto é obrigatório" });
  }

  const precoNum = Number(preco);
  if (isNaN(precoNum) || precoNum <= 0) {
    return res.status(400).json({
      erro: "Preço inválido"
    });
  }

  let estoqueNum = 0;
  if (estoque !== undefined) {
    estoqueNum = Number(estoque);

    if (isNaN(estoqueNum) || estoqueNum < 0) {
      return res.status(400).json({
        erro: "Estoque inválido"
      });
    }
  }

  const sqlLoja = `
    SELECT id_loja FROM lojas WHERE id_usuario = ?
  `;

  connection.query(sqlLoja, [id_usuario], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro no servidor" });

    if (result.length === 0) {
      return res.status(404).json({
        erro: "Você não possui uma loja"
      });
    }

    const id_loja = result[0].id_loja;

    const sqlProduto = `
      INSERT INTO produtos 
      (id_loja, id_categoria, nome_produto, descricao, preco, estoque, imagem)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    connection.query(
      sqlProduto,
      [
        id_loja,
        id_categoria || null,
        nome_produto,
        descricao,
        precoNum,
        estoqueNum,
        imagem
      ],
      (err2) => {
        if (err2) {
          console.log(err2);
          return res.status(500).json({ erro: "Erro ao criar produto" });
        }

        return res.status(201).json({
          mensagem: "Produto criado com sucesso!"
        });
      }
    );
  });
};


exports.getMeusProdutos = (req, res) => {

  const id_usuario = req.user.id;

  const sql = `
    SELECT p.*, c.nome_categoria
    FROM produtos p
    INNER JOIN lojas l ON p.id_loja = l.id_loja
    LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
    WHERE l.id_usuario = ?
  `;

  connection.query(sql, [id_usuario], (err, result) => {
    if (err) {
      console.log("ERRO", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    const produtos = result.map(p => ({
      ...p,
      imagem_url: p.imagem
        ? `http://localhost:3000/uploads/${p.imagem}`
        : null
    }));

    return res.json({ produtos });
  });
};

exports.updateProduto = (req, res) => {

  const { id } = req.params;
  const { nome_produto,id_categoria, descricao, preco, estoque } = req.body;
  const id_usuario = req.user.id;

  const novaImagem = req.file ? req.file.filename : null;

  const sqlCheck = `
    SELECT p.id_produto
    FROM produtos p
    INNER JOIN lojas l ON p.id_loja = l.id_loja
    WHERE p.id_produto = ? AND l.id_usuario = ?
  `;

  connection.query(sqlCheck, [id, id_usuario], (err, result) => {
    if (err) {
      console.log("ERRO CHECK:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    if (result.length === 0) {
      return res.status(403).json({
        erro: "Produto não pertence à sua loja"
      });
    }

    //  UPDATE DINÂMICO
    const campos = [];
    const valores = [];

    if (nome_produto) {
      campos.push("nome_produto = ?");
      valores.push(nome_produto);
    }

    if (id_categoria) {
      campos.push("id_categoria = ?");
      valores.push(id_categoria);
    }

    if (descricao) {
      campos.push("descricao = ?");
      valores.push(descricao);
    }

    if (preco) {
      const precoNum = Number(preco);
      if (isNaN(precoNum) || precoNum <= 0) {
        return res.status(400).json({ erro: "Preço inválido" });
      }

      campos.push("preco = ?");
      valores.push(precoNum);
    }

    if (estoque !== undefined) {
      const estoqueNum = Number(estoque);

      if (isNaN(estoqueNum) || estoqueNum < 0) {
        return res.status(400).json({ erro: "Estoque inválido" });
      }

      campos.push("estoque = ?");
      valores.push(estoqueNum);
    }

    if (novaImagem) {
      campos.push("imagem = ?");
      valores.push(novaImagem);
    }

    if (campos.length === 0) {
      return res.status(400).json({
        erro: "Nenhum campo para atualizar"
      });
    }

    valores.push(id);

    const sqlUpdate = `
      UPDATE produtos
      SET ${campos.join(", ")}
      WHERE id_produto = ?
    `;

    connection.query(sqlUpdate, valores, (err2) => {
      if (err2) {
        console.log("ERRO UPDATE:", err2);
        return res.status(500).json({
          erro: "Erro ao atualizar produto"
        });
      }

      return res.json({
        mensagem: "Produto atualizado com sucesso!"
      });
    });
  });
};


exports.deleteProduto = (req, res) => {

  const { id } = req.params;
  const id_usuario = req.user.id;

  // VERIFICAR PERMISSÃO
  const sqlCheck = `
    SELECT p.id_produto
    FROM produtos p
    INNER JOIN lojas l ON p.id_loja = l.id_loja
    WHERE p.id_produto = ? AND l.id_usuario = ?
  `;

  connection.query(sqlCheck, [id, id_usuario], (err, result) => {
    if (err) {
      console.log("ERRO CHECK:", err);
      return res.status(500).json({ erro: "Erro no servidor" });
    }

    if (result.length === 0) {
      return res.status(403).json({
        erro: "Produto não pertence à sua loja"
      });
    }

    //  DELETAR
    const sqlDelete = `
      DELETE FROM produtos WHERE id_produto = ?
    `;

    connection.query(sqlDelete, [id], (err2) => {
      if (err2) {
        console.log("ERRO DELETE:", err2);
        return res.status(500).json({
          erro: "Erro ao deletar produto"
        });
      }

      return res.json({
        mensagem: "Produto deletado com sucesso!"
      });
    });
  });
};


exports.getCategorias = (req, res) => {
  
  const sql = `SELECT * FROM  categorias`;

  connection.query(sql, (err, result) => {
    if(err) {
      console.log("ERRO:", err)
      return res.status(500).json({ erro: "Erro no servidor"})
    }

    return res.json({ categorias: result})
  })
}

