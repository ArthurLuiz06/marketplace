import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

function UserLogin() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");


  const navigate = useNavigate()


  function entrar() {
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
        if (data.usuario) {
          alert(data.mensagem);

          navigate("/home", {
            state: {
              nome: data.usuario.nome,
              email: data.usuario.email
            }
          })
        } else {
          alert('Erro no login')
        }
      })
      .catch(err => {
        console.log(err);
        alert('Erro ao conectar com o servidor')
      })
  }

  return (
    <form onSubmit={entrar}>
      <h2>LOGIN</h2>

      <input
        type='email'
        placeholder='Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type='password'
        placeholder='Senha'
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <button type='submit'>Entrar</button>

    </form>

  );

}

export default UserLogin