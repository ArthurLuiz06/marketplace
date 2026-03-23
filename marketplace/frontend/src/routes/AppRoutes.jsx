import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../Pages/Login/userLogin";
import Cadastro from "../Pages/CadastroUsuarios/CadastroUsuario";
import Home from "../Pages/Home/Home"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/home" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;