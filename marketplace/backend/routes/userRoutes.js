const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController")
const criarLojaController = require("../controllers/lojaController")
const authMiddleware = require("../middleware/auth")

// Adiciona usuarios
router.post("/cadastro", userController.createUser);
router.post("/login", userController.loginUser)

router.post("/loja", authMiddleware, criarLojaController.createLoja)
router.post("/minha-loja", authMiddleware, criarLojaController.getMinhaLoja)

// Consutar perfil
router.put("/perfil", authMiddleware,userController.updatePerfil)
router.get("/perfil", authMiddleware, userController.getPerfil);

// Atualizar senha
router.put("/perfil/senha", authMiddleware,userController.updateSenha)

module.exports = router;