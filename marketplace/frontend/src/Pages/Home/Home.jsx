import { useNavigate } from "react-router-dom";
import "./HomeStyle.css";
import { Zap, ShieldCheck, Truck } from "lucide-react";
import logo from "../../IMG/logo.png";
import { useEffect, useState } from "react";

function Home() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false)
  const [minhaLoja, setMinhaLoja] = useState(null)

  const user = JSON.parse(localStorage.getItem("user"))

  useEffect(() => {
    if (open && token) {
      fetch("http://localhost:3001/minha-loja", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.loja) {
            setMinhaLoja(data.loja)
          } else {
            setMinhaLoja(null)
          }
        })
        .catch(() => setMinhaLoja(null))
    }
  }, [open]);

  const nomeLoja = "ByteShop";
  const token = localStorage.getItem("token");

  //  fluxo vendedor
  const handleVendedor = () => {
    if (!token) {
      navigate("/login", { state: { redirect: "/loja" } });
    } else {
      navigate("/loja");
    }
  };


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/")
  }

  return (
    <div className="home-container">

      {/* NAVBAR */}
      <div className="navbar">
        <img src={logo} alt="ByteShop Logo" className="logo-img" />
        <div className="nav-buttons">
          {!token ? (
            <button onClick={() => navigate("/login")}>
              Login
            </button>
          ) : (
            <div className="user-menu">
              <button onClick={() => setOpen(!open)}>
                {user?.nome || "Usuário"}
              </button>

              {open && (
                <div className="dropdown-menu">

                  <div className="user-info">
                    <strong>{user?.nome}</strong>
                    <p>Minha conta</p>
                  </div>

                  <hr />

                  <button onClick={() => navigate("/perfil")}>
                    Meu perfil
                  </button>

                  {minhaLoja && (
                    <button onClick={() => navigate("/minha-loja")}>
                      Minha loja
                    </button>
                  )}

                  <hr />

                  <button onClick={logout}>
                    Sair
                  </button>

                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* HERO */}
      <div className="hero">
        <h1>Bem-vindo</h1>
        <h2>à {nomeLoja}</h2>

        <p>
          A melhor loja de peças eletrônicas.
          Performance, qualidade e tecnologia em um só lugar.
        </p>

        <div className="hero-buttons">
          <button
            className="btn-primary"
            onClick={() => navigate("/produtos")}
          >
            Ver Produtos
          </button>

          {/*  BOTÃO ATUALIZADO */}
          <button
            className="btn-outline"
            onClick={handleVendedor}
          >
            Quero ser vendedor
          </button>
        </div>
      </div>

      {/* DESTAQUE */}
      <section className="destaque">
        <h2>Por que escolher a ByteShop?</h2>

        <div className="cards">
          <div className="card">
            <Zap size={28} className="icon" />
            <h3> Alta Performance</h3>
            <p>Peças selecionadas para máximo desempenho.</p>
          </div>

          <div className="card">
            <ShieldCheck size={28} className="icon" />
            <h3>Garantia</h3>
            <p>Produtos confiáveis com garantia real.</p>
          </div>

          <div className="card">
            <Truck size={28} className="icon" />
            <h3>Entrega Rápida</h3>
            <p>Receba seus produtos com agilidade.</p>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;