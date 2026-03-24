import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import "./LoginStyle.css"

function UserLogin() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [saindo, setSaindo] = useState(false)


  const navigate = useNavigate()


  function irParaCadastro() {
    setSaindo(true);

    setTimeout(() => {
      navigate("/cadastro");
    }, 300) // tempo de animação
  }

  function entrar(e) {
    e.preventDefault();

    if (email === "" || senha === "") {
      alert("Prencha todos os campos")
      return
    }

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

          // salva token
          localStorage.setItem("token", data.token);

          navigate("/", {
            state: {
              nome: data.usuario.nome
            }
          });

        } else {
          alert(data.mensagem || "Erro no login");
        }
      })
      .catch(err => {
        console.log(err);
        alert('Erro ao conectar com o servidor')
      })
  }

 return (
  <div className={`login-container ${saindo ? "fade-out" : "fade-in"}`}>
    <form className="login-box" onSubmit={entrar}>
      <h2>LOGIN</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <button type="submit">Entrar</button>

      <p>
        Não tem conta?{" "}
        <span onClick= {() => navigate("/cadastro")}
        >
          Cadastre-se
        </span>
      </p>
    </form>
  </div>
);

}

export default UserLogin