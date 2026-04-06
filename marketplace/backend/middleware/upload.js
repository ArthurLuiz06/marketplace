const multer = require("multer")
const path = require("path")

// configuração de armazenamento 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); //pasta onde vai salvar
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});


// Filtro (só imagens)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];

    if(allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Arquivo inválido. Apenas imagens são permitidas."))
    }
};

const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;