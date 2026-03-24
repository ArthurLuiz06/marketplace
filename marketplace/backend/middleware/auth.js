const jwt = require("jsonwebtoken")

function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json({error: "Token não enviado"})
    }

    const token = authHeader.split(" ") [1]

    try{
        const decoded = jwt.verify(token, "seu_segredo")

        req.user = decoded;

        next()
    }catch(error) {
        return req.status(401).json({error: "token inválido"})
    }
}

module.exports = authMiddleware