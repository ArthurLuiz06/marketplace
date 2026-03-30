import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CadastroStyle.css";
import { Eye, EyeOff } from "lucide-react";

function CadastroUsuario() {
  const navigate = useNavigate();

  // direção animação
  const [direcao, setDirecao] = useState("direita");

  // etapa
  const [etapa, setEtapa] = useState(1);

  // loading
  const [loading, setLoading] = useState(false);

  // senha
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);

  // dados usuário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  // endereço
  const [rua, setRua] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");

  // erros
  const [erroNome, setErroNome] = useState("");
  const [erroEmail, setErroEmail] = useState("");
  const [erroSenha, setErroSenha] = useState("");

  // validações visuais
  const nomeValido = nome.length >= 3;
  const emailValido = email.includes("@") && email.includes(".");
  const senhaValida = senha.length >= 6;

  function proximo() {
    if (!nomeValido) {
      setErroNome("Digite um nome válido!");
      return;
    } else setErroNome("");

    if (!emailValido) {
      setErroEmail("Digite um email válido!");
      return;
    } else setErroEmail("");

    if (!senhaValida) {
      setErroSenha("Mínimo de 6 caracteres!");
      return;
    } else setErroSenha("");

    setDirecao("direita");
    setEtapa(2);
  }

  function voltar() {
    setDirecao("esquerda");
    setEtapa(1);
  }

  function entrar(e) {
    e.preventDefault();

    if (!rua || !cidade || !estado || !bairro || !cep || !numero) {
      alert("Preencha todos os campos!");
      return;
    }

    setLoading(true);

    fetch("http://localhost:3001/cadastro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
        cep,
      }),
    })
      .then((res) => res.text())
      .then((data) => {
        alert(data);
        navigate("/");

        // reset
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
      .catch((err) => {
        console.error(err);
        alert("Erro ao conectar com o servidor");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="container">
      <form className="cadastro-box" onSubmit={entrar}>
        <h2>Cadastro</h2>

        {/* PROGRESS BAR */}
        <div className="progress-bar">
          <div className="progress"
            style={{ width: etapa === 1 ? "50%" : "100%" }} />
        </div>

        {/* ETAPA 1 */}
        {etapa === 1 && (
          <div className={`step1 ${direcao}`}>
            <input
              className={
                erroNome
                  ? "input-error"
                  : nome
                    ? "input-success"
                    : ""
              }
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            {erroNome && <span className="erro">{erroNome}</span>}

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
                onClick={() =>
                  setMostrarSenhaAtual(!mostrarSenhaAtual)
                }
                className="eye-icon"
              >
                {mostrarSenhaAtual ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </span>
            </div>
            {erroSenha && <span className="erro">{erroSenha}</span>}

            <div className="button-group">
              <button
                type="button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>

              <button type="button" onClick={proximo}>
                Próximo →
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2 */}
        {etapa === 2 && (
          <div className={`step2 ${direcao}`}>
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
              placeholder="Estado (ex: AL)"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            />

            <input
              type="text"
              placeholder="Bairro"
              value={bairro}
              onChange={(e) => setBairro(e.target.value)}
            />

            <input
              type="text"
              placeholder="CEP"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
            />

            <input
              type="text"
              placeholder="Número"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
            />

            <div className="button-group">
              <button type="button" onClick={voltar}>
                ← Voltar
              </button>

              <button type="submit" disabled={loading}>
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}

export default CadastroUsuario;