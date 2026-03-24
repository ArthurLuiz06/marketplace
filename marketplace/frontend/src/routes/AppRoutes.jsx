import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../Pages/Login/userLogin";
import Cadastro from "../Pages/CadastroUsuarios/CadastroUsuario";
import Home from "../Pages/Home/Home"
import Perfil from "../Pages/Perfil/Perfil"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<Home />}></Route>
        <Route path="/perfil" element={<Perfil />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;