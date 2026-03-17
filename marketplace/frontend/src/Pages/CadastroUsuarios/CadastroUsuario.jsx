import { useState } from "react";
import {useNavigate} from "react-router-dom"


function CadastroUsuario() {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("");

    const navigate = useNavigate();

    function entrar() {
        if(nome === "" || email === "" || senha === "" ) {
            alert('Prencha todos os campos')
            return;
        }

        if(!email.includes("@") || !email.includes(".")) {
            alert('Digite um email válido!')
            setEmail('')
            return
        }

        alert('Login efetuado');

        navigate('/', {
            state: {nome, email}
        })
    }


     return (
    <div className="container">
      <div className="login-box">
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
        placeholder="Digite uma senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        />

        <button onClick={entrar}>Entrar</button>
      </div>
    </div>
  );
}


export default CadastroUsuario