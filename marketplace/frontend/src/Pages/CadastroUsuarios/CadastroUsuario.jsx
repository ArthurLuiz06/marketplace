import { useState } from "react";
import {useNavigate} from "react-router-dom"

function CadastroUsuario() {

  const navigate = useNavigate("")

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


  // Estado de erro
  const [erroNome, setErroNome] = useState("")
  const [erroEmail, setErroEmail] = useState("")
  const [erroSenha, setErroSenha] = useState("")


  function proximo() {
    let valido = true

    if (nome === "") {
      setErroNome('Digite seu nome')
      valido = false
      return;
    } else {
      setErroNome("")
    }

    if (!email.includes("@") || !email.includes(".")) {
      setErroEmail('Digite um email válido!');
      valido = false
      return;
    } else {
      setErroEmail("")
    }

    if (senha.length < 4) {
      setErroSenha('Mínimo de 4 caracteres!')
      valido = false
      return;
    } else {
      setErroSenha("")
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
        numero,
        cidade,
        estado,
        bairro,
        cep
      })
    })
      .then(res => res.text())
      .then(data => {
        alert(data);
        navigate("/")

        setNome("");
        setEmail("");
        setSenha("");
        setRua("");
        setNumero("");
        setCidade("");
        setBairro("");
        setCep("");
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
            {erroNome && <span className="erro">{erroNome}</span>}

            <input
              type="email"
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {erroEmail && <span className="erro">{erroEmail}</span>}


            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            {erroSenha && <span className="erro">{erroSenha}</span>}

            <div>
              <button type="button" onClick={() => navigate("/")}>Login</button>
            <button type="button" onClick={proximo}>
              Próximo →
            </button>
            </div>
          </div>
        )}

        {/* ETAPA 2 */}
        {etapa === 2 && (
          <div className="step2">
            <label>Endereço</label>
            <input
              type="text"
              placeholder="Rua"
              value={rua}
              onChange={(e) => setRua(e.target.value)}
            />

            <label>Cidade</label>
            <input
              type="text"
              placeholder="Cidade"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
            />

            <label>Estado</label>
            <input
              type="text"
              placeholder="Ex: AL"
              minLength={2}
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />


            <label>Logradouro</label>
            <input
              type="text"
              placeholder="Ex: Centro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />

            <label>CEP</label>
            <input
              type="number"
              placeholder="Ex: 00000-000"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />

            <label>Numero</label>
            <input
              type="text"
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