import { useState } from "react";

function CadastroUsuario() {
  
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("");


  function entrar(e) {
    e.preventDefault();

    if (nome === "" || email === "" || senha === "") {
      alert('Prencha todos os campos')
      return;
    } else {
      alert('Login efetuado');
    }

  }

  return (
    <div className="container">
      <header>
        <title>CADASTRO</title>
      </header>
      <form className="cadastro-box" onSubmit={entrar} >
        <h2>CADASTRO</h2>

        <input
          type="text"
          placeholder="Digite seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />

        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />


        <input
          type="password"
          minLength={4}
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}


export default CadastroUsuario