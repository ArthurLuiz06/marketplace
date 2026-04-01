import { useState, useEffect } from "react";
import "./PerfilStyle.css";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

function Perfil() {
  const [user, setUser] = useState(null);
  const [editando, setEditando] = useState(false);


  //Ocutar senha
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);

  // Mudar senha
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");

  //Mudar informações de usuario
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [rua, setRua] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [bairro, setBairro] = useState("");
  const [numero, setNumero] = useState("");
  const [cep, setCep] = useState("");

  const navigate = useNavigate();

  function salvar() {
    const token = localStorage.getItem("token");

    // VALIDAÇÃO DE SENHA
    if (novaSenha && novaSenha.length < 6) {
      alert("Nova senha deve ter no mínimo 6 caracteres");
      return;
    }

    //  SE QUISER TROCAR SENHA
    if (senhaAtual && novaSenha) {
      fetch("http://localhost:3001/perfil/senha", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          senhaAtual,
          novaSenha
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.erro) {
            alert(data.erro);
            return;
          }

          alert("Senha atualizada! Faça login novamente.");

          //  LOGOUT POR SEGURANÇA
          localStorage.removeItem("token");
          navigate("/login");
        })
        .catch(err => {
          console.log(err);
          alert("Erro ao atualizar senha");
        });

      return; //  evita continuar para update normal
    }

    //  ATUALIZA PERFIL NORMAL
    fetch("http://localhost:3001/perfil", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        nome,
        email,
        rua,
        cidade,
        estado,
        bairro,
        numero,
        cep
      })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.mensagem || "Atualizado com sucesso!");
        setEditando(false);
      })
      .catch(err => {
        console.log(err);
        alert("Erro ao atualizar");
      });
  }

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:3001/perfil", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then(data => {
        setUser(data.user);

        setNome(data.user.nome || "");
        setEmail(data.user.email || "");
        setRua(data.user.rua || "");
        setCidade(data.user.cidade || "");
        setEstado(data.user.estado || "");
        setBairro(data.user.bairro || "");
        setNumero(data.user.numero || "");
        setCep(data.user.cep || "");
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, []);

  if (!user) return <p style={{ color: "white" }}>Carregando...</p>;

  return (
    <div className="perfil-container">
      <div className="perfil-box">
        <h2>Meu Perfil</h2>

        <div className="perfil-info">

          <h3>Dados pessoais</h3>

          <label>Nome</label>
          <input
            value={nome}
            disabled={!editando}
            onChange={(e) => setNome(e.target.value)}
          />

          <label>Email</label>
          <input
            value={email}
            disabled={!editando}
            onChange={(e) => setEmail(e.target.value)}
          />

          <h3>Segurança</h3>

          <label>Senha Atual</label>
          <div className="input-password">
            <input
              type={mostrarSenhaAtual ? "text" : "password"}
              value={senhaAtual}
              disabled={!editando}
              onChange={(e) => setSenhaAtual(e.target.value)}
            />
            <span onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)} className="eye-icon">
              {mostrarSenhaAtual ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <label>Nova Senha</label>
          <div className="input-password">
            <input
              type={mostrarNovaSenha ? "text" : "password"}
              value={novaSenha}
              disabled={!editando}
              onChange={(e) => setNovaSenha(e.target.value)}
            />
            <span onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)} className="eye-icon">
              {mostrarNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <h3>Endereço</h3>

          {/* Rua + Número */}
          <div className="input-row">
            <div>
              <label>Rua</label>
              <input
                value={rua}
                disabled={!editando}
                onChange={(e) => setRua(e.target.value)}
              />
            </div>

            <div>
              <label>Número</label>
              <input
                value={numero}
                disabled={!editando}
                onChange={(e) => setNumero(e.target.value)}
              />
            </div>
          </div>

          {/* Bairro */}
          <label>Bairro</label>
          <input
            value={bairro}
            disabled={!editando}
            onChange={(e) => setBairro(e.target.value)}
          />

          {/* Cidade + Estado */}
          <div className="input-row">
            <div>
              <label>Cidade</label>
              <input
                value={cidade}
                disabled={!editando}
                onChange={(e) => setCidade(e.target.value)}
              />
            </div>

            <div>
              <label>Estado</label>
              <input
                value={estado}
                disabled={!editando}
                onChange={(e) => setEstado(e.target.value)}
              />
            </div>
          </div>

          {/* CEP */}
          <label>CEP</label>
          <input
            value={cep}
            disabled={!editando}
            onChange={(e) => setCep(e.target.value)}
          />

        </div>

        {!editando ? (
          <button onClick={() => setEditando(true)}>
            Editar Perfil
          </button>
        ) : (
          <button onClick={salvar}>
            Salvar Alterações
          </button>
        )}

        <button 
        className="btn-secundario"
        onClick={() => navigate("/")}
        >
          Voltar
        </button>
      </div>
    </div>
  );
}

export default Perfil;