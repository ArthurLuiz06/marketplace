const connection = require("../database/connection")
const bcrypt = require("bcrypt")

exports.createUser = async (req, res) => {
  const { nome, email, senha, rua, numero, cidade, estado, bairro, cep  } = req.body;

  try {
    // criptografa senha
    const senhaHash = await bcrypt.hash(senha, 10);

    const sqlUser = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";

    connection.query(sqlUser, [nome, email, senhaHash], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erro ao cadastrar usuário");
      }

      const idUsuario = result.insertId;

      console.log(req.body);
      
      const sqlEndereco = `
        INSERT INTO enderecos (id_usuario, rua, numero, cidade, estado, bairro, cep)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      connection.query(
        sqlEndereco,
        [idUsuario, rua, numero || null, cidade, estado, bairro, cep],
        (err2) => {
          if (err2) {
            console.error(err2);
            return res.status(500).send("Erro ao salvar endereço");
          }

          res.status(201).send("Usuário cadastrado com segurança!");
        }
      );
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Erro no servidor");
  }
};


exports.loginUser = (req, res) => {
  const { email, senha } = req.body;

  const sql = "SELECT * FROM usuarios WHERE email = ?";

  connection.query(sql, [email], async (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erro no servidor");
    }

    if (result.length === 0) {
      return res.status(401).send("Usuário não encontrado");
    }

    const usuario = result[0];

    // compara senha criptografada
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).send("Senha incorreta");
    }

    res.status(200).json({
      mensagem: "Login seguro realizado!",
      usuario: {
        id: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  });
};