const express = require("express");
const router = express.Router();

const userModel = require("../models/userModel")

router.post("/cadastro", userModel.createUser);

module.exports = router;