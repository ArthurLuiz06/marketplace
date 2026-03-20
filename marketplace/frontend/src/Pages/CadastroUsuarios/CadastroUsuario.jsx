import { useState } from "react";

function CadastroUsuario() {

  //Controle de etapa
  const [etapa, setEtapa] = useState(1)

  //Dados dos usuarios
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("");

  //Dados de endereço
  const [rua, setRua] = useState("")
  const [cidade, setCidade] = useState("")
  const [estado, setEstado] = useState("")
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");


  function proximo() {
    if (nome === "" || email === "" || senha === "") {
      alert('Prencha todos os campos')
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      alert('Digite um email válido!');
      setEmail("");
      return;
    }

    if (senha.length < 4) {
      alert('A senha deve ter no minimo 4 caracteres!')
      setSenha("")
      return;
    }

    setEtapa(2)
  }

  function voltar() {
    setEtapa(1);
  }


  function entrar(e) {
    e.preventDefault();

    if (rua === "" || cidade === "" || estado === "" || bairro === "" || cep === "" || numero === "") {
      alert('Preencha todos os campos!');
      return;
    }

    //Conexão com o Back-End
    fetch("http://localhost:3001/cadastro", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        nome,
        email,
        senha,
        rua,
        cidade,
        estado
      })
    })
      .then(res => res.text())
      .then(data => {
        alert(data);

        setNome("");
        setEmail("");
        setSenha("");
        setRua("");
        setCidade("");
        setCidade("");
        setEtapa(1);
      })
      .catch(err => {
        console.error(err);
        alert("Erro ao conectar com o servidor");
      })

  }

  return (
    <div className="container">
      <header>
        <title>CADASTRO</title>
      </header>
      <form className="cadastro-box" onSubmit={entrar} >
        <h2>CADASTRO</h2>

        {/* ETAPA 1 */}
        {etapa === 1 && (
          <div className="step1">
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
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />

            <button type="button" onClick={proximo}>
              Próximo →
            </button>
          </div>
        )}

        {/* ETAPA 2 */}
        {etapa === 2 && (
          <div className="step2">
            <input
              type="text"
              placeholder="Rua"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />

            <input
              type="text"
              placeholder="Cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />

            <input
              type="text"
              placeholder="Ex: AL"
              minLength={2}
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />

            <input 
            type="text"
            placeholder="Ex: Centro"
            value={bairro}
            onChange={(e) => setBairro(e.target.value)} 
            />

            <input 
            type="number"
            placeholder="Ex: 00000-000"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            />

            <input 
            type="number"
            placeholder="Ex: 00"
            value={numero}
            onChange={(e) => setNumero(e.target.value)} 
            />

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="button" onClick={voltar}>
                ← Voltar
              </button>

              <button type="submit">
                Cadastrar
              </button>
            </div>
          </div>
        )}

      </form>
    </div>
  );
}


export default CadastroUsuario