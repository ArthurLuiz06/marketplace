import { useNavigate } from "react-router-dom";
import "./HomeStyle.css";
import { Zap, ShieldCheck, Truck, User, Store, LogOut } from "lucide-react";
import logo from "../../IMG/logo.png";
import { useEffect, useRef, useState } from "react";

function Home() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false)
  const [minhaLoja, setMinhaLoja] = useState(null)
  const [mensagem, setMensagem] = useState("");

  const user = JSON.parse(localStorage.getItem("user"))

  const token = localStorage.getItem("token");

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:3001/minha-loja", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setMinhaLoja(data.loja || null);
      })
      .catch(() => setMinhaLoja(null));
  }, []);
  const nomeLoja = "ByteShop";

  //  fluxo vendedor
  const handleVendedor = async () => {
    if (!token) {
      navigate("/login", { state: { redirect: "/loja" } });
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/minha-loja", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (data.loja) {
        setMensagem("Você já possui uma loja!");
        setTimeout(() => {
          setMensagem("")
        }, 3000)
      } else {
        navigate("/loja");
      }

    } catch (err) {
      console.error(err);
      setMensagem("Erro ao verificar loja");
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
            <div className="user-menu" ref={menuRef}>
              <button onClick={() => setOpen(!open)} className="user-button">
                <div className="avatar">
                  {user?.nome?.charAt(0).toUpperCase()}
                </div>
                {user?.nome}
              </button>

              <div className={`dropdown-menu ${open ? "open" : ""}`}>

                <div className="user-info">
                  <div className="avatar big">
                    {user?.nome?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <strong>{user?.nome}</strong>
                    <p>Minha conta</p>
                  </div>
                </div>

                <hr />

                <button onClick={() => navigate("/perfil")}>
                  <User size={16} /> Meu perfil
                </button>

                {minhaLoja && (
                  <button onClick={() => navigate("/minha-loja")}>
                    <Store size={16} /> Minha loja
                  </button>
                )}

                <button onClick={logout} className="logout">
                  <LogOut size={16} /> Sair
                </button>

              </div>
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

      {mensagem && (
        <div className="aviso">
          {mensagem}
        </div>
      )}


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