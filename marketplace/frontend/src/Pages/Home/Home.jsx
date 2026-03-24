import { useLocation, useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const location = useLocation()
  const nome = location.state?.nome || "Usuario";
  const nomeLoja = "ByteShop"

  return (
    <div>
      <header>
        <title>ByteShop</title>
      </header>
      <h1>Bem-vindo, {nome} 👋</h1>
      <h2>à {nomeLoja}</h2>

      <button onClick={() => navigate("/login")}>
        Login
      </button>

      <button onClick={() => navigate("/perfil")}>
        Meu Perfil
      </button>

      <button onClick={() => navigate("/produtos")}>
        Ver Produtos
      </button>

      <button onClick={() => navigate("/vendedor")}>
        Quero ser vendedor
      </button>

    </div>
  );
}

export default Home;