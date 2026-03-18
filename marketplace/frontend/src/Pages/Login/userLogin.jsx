import { useLocation, useNavigate } from 'react-router-dom'


function UserLogin() {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email
  const senha = location.state?.senha


  return (

    <div className="container">
      <div className="login-box">
        <h2>LOGIN</h2>

        <input
          type="email"
          placeholder="Digite seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Digite sua senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />

        <button type='button'>Entrar</button>
      </div>

    </div>
  );

}

export default UserLogin