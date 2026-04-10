const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const criarLojaController = require("../controllers/lojaController");
const produtoController = require("../controllers/produtoController");

const upload = require("../middleware/upload");
const authMiddleware = require("../middleware/auth");

// USUÁRIOS
router.post("/cadastro", userController.createUser);
router.post("/login", userController.loginUser);


//  LOJA

router.post("/loja", authMiddleware, criarLojaController.createLoja);
router.get("/minha-loja", authMiddleware, criarLojaController.getMinhaLoja);


//  PERFIL

router.get("/perfil", authMiddleware, userController.getPerfil);
router.put("/perfil", authMiddleware, userController.updatePerfil);
router.put("/perfil/senha", authMiddleware, userController.updateSenha);


//  PRODUTOS

//  PÚBLICO (listar produtos)
router.get("/produtos", produtoController.getProdutos);

//  PRIVADO (produtos da minha loja)
router.get("/produtos/minha-loja", authMiddleware, produtoController.getMeusProdutos);

//  CRIAR produto
router.post(
  "/produtos",
  authMiddleware,
  upload.single("imagem"),
  produtoController.createProduto
);

//  ATUALIZAR produto
router.put(
  "/produtos/:id",
  authMiddleware,
  upload.single("imagem"),
  produtoController.updateProduto
);

//  DELETAR produto ( corrigido)
router.delete(
  "/produtos/:id",
  authMiddleware,
  produtoController.deleteProduto
);


// CATEGORIAS

router.get("/categorias", produtoController.getCategorias);


module.exports = router;