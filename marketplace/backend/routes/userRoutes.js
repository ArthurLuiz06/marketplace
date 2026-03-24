const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController")
const authMiddleware = require("../middleware/auth")

router.post("/cadastro", userController.createUser);
router.post("/login", userController.loginUser)

router.put("/perfil", authMiddleware,userController.updatePerfil)
router.get("/perfil", authMiddleware, userController.getPerfil);

module.exports = router;