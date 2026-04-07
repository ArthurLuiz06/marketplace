const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController")
const criarLojaController = require("../controllers/lojaController")
const produtoController = require("../controllers/produtoController")
const upload = require("../middleware/upload")
const authMiddleware = require("../middleware/auth")

// Adiciona usuarios
router.post("/cadastro", userController.createUser);
router.post("/login", userController.loginUser)

//Rotas de Loja
router.post("/loja", authMiddleware, criarLojaController.createLoja)
router.get("/minha-loja", authMiddleware, criarLojaController.getMinhaLoja)

// Consutar perfil
router.put("/perfil", authMiddleware,userController.updatePerfil)
router.get("/perfil", authMiddleware, userController.getPerfil);

// Atualizar senha
router.put("/perfil/senha", authMiddleware,userController.updateSenha)

//Rotas de produtos                                  nome do campo  
router.post("/produtos", authMiddleware, upload.single("imagem") ,produtoController.createProduto);
router.get("/produtos/minha-loja", authMiddleware, produtoController.getMeusProdutos);
router.put("/produtos/:id", authMiddleware, produtoController.updateProduto);
router.delete("/produtos:id", authMiddleware, produtoController.deleteProduto);

//Categorias de produtos
router.get("/categorias",produtoController.getCategorias)
module.exports = router;