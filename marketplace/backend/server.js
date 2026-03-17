const express = require("express");
const cors = require("cors");

const app = express();
const useRoutes = require("./routes/userRoutes");
const { use } = require("react");

app.use(cors());
app.use(express.json());

app.use(useRoutes);

app.listen(3001, () => {
  console.log("Servidor rodando na porta 3001");
});