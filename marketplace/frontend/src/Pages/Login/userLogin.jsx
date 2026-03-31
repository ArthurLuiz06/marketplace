import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import "./LoginStyle.css";
import { Eye, EyeOff } from "lucide-react";

function UserLogin() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [saindo, setSaindo] = useState(false);

  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);

  const navigate = useNavigate();
  const location = useLocation(); 

  // validações
  const emailValido = email.includes("@") && email.includes(".");
  const senhaValida = senha.length >= 6;

  function entrar(e) {
    e.preventDefault();

    let valido = true;

    if (!emailValido) {
      setErroEmail("Digite um email válido!");
      valido = false;
    } else {
      setErroEmail("");
    }

    if (!senhaValida) {
      setErroSenha("Mínimo de 6 caracteres!");
      valido = false;
    } else {
      setErroSenha("");
    }

    if (!valido) return;

    setLoading(true);

    fetch("http://localhost:3001/login", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        senha
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem("token", data.token);

          localStorage.setItem("user",JSON.stringify({
            nome: data.usuario?.nome
          }))
          
          //REDIRECIONAMENTO INTELIGENTE
          const redirect = location.state?.redirect || "/";

          navigate(redirect);

        } else {
          alert(data.mensagem || "Erro no login");
        }
      })
      .catch(err => {
        console.log(err);
        alert('Erro ao conectar com o servidor');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className={`login-container ${saindo ? "fade-out" : "fade-in"}`}>
      <form className="login-box" onSubmit={entrar}>
        <h2>Login</h2>

        {/* EMAIL */}
        <input
          className={
            erroEmail
              ? "input-error"
              : email
                ? "input-success"
                : ""
          }
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {erroEmail && <span className="erro">{erroEmail}</span>}

        {/* SENHA */}
        <div className="input-password">
          <input
            className={
              erroSenha
                ? "input-error"
                : senha
                  ? "input-success"
                  : ""
            }
            type={mostrarSenhaAtual ? "text" : "password"}
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <span
            onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
            className="eye-icon"
          >
            {mostrarSenhaAtual ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>
        {erroSenha && <span className="erro">{erroSenha}</span>}

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <p>
          Não tem conta?{" "}
          <span onClick={() => navigate("/cadastro", { state: location.state })}>
            Cadastre-se
          </span>
        </p>
      </form>
    </div>
  );
}

export default UserLogin;