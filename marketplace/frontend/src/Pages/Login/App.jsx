function login() {

    return(

     <div className="container">
      <div className="login-box">
        <h2>LOGIN</h2>

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

        <button onClick={entrar}>Entrar</button>
        </div>
        
        </div>
    );

}