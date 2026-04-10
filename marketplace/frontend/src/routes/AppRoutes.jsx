import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../Pages/Login/userLogin";
import Cadastro from "../Pages/CadastroUsuarios/CadastroUsuario";
import Home from "../Pages/Home/Home"
import Perfil from "../Pages/Perfil/Perfil"
import CriarLoja from "../Pages/CriarLoja/CriarLoja"
import MinhaLoja from "../Pages/MinhaLoja/minhaLoja";
import CadastroProduto from "../Pages/CadastroProduto/CadastroProduto";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<Home />}></Route>
        <Route path="/perfil" element={<Perfil />}></Route>
        <Route path="/loja" element={<CriarLoja />}></Route>
        { <Route path="minha-loja" element={localStorage.getItem("token")
           ? <MinhaLoja /> 
           : <Navigate to="/login" />}></Route> }
           {/* <Route path="/minha-loja" element={<MinhaLoja />}></Route> */}
           <Route path="/minha-loja/novo-produto" element={<CadastroProduto />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;