const express = require("express");
const cors = require("cors");

const app = express();
const useRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"))

app.use(useRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando!");
});

app.listen(3001, () => {
  console.log("Servidor rodando na porta http://localhost:3001");
});