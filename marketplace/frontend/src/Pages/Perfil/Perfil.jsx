import { useState, useEffect } from "react";
import "./PerfilStyle.css";
import { useNavigate } from "react-router-dom";

function Perfil() {
  const [user, setUser] = useState(null);
  const [editando, setEditando] = useState(false)

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
        setUser(data.user)

        setNome(data.user.nome || "");
        setEmail(data.user.email || "");

        // preparado mesmo que backend ainda não envie
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

          <label>Rua</label>
          <input
            value={rua}
            disabled={!editando}
            onChange={(e) => setRua(e.target.value)}
          />

          <label>Cidade</label>
          <input
            value={cidade}
            disabled={!editando}
            onChange={(e) => setCidade(e.target.value)}
          />

          <label>Estado</label>
          <input
            value={estado}
            disabled={!editando}
            onChange={(e) => setEstado(e.target.value)}
          />

          <label>Bairro</label>
          <input
            value={bairro}
            disabled={!editando}
            onChange={(e) => setBairro(e.target.value)}
          />

          <label>CEP</label>
          <input
            value={cep}
            disabled={!editando}
            onChange={(e) => setCep(e.target.value)}
          />

          <label>Número</label>
          <input
            value={numero}
            disabled={!editando}
            onChange={(e) => setNumero(e.target.value)}
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
      </div>
    </div>
  );
}

export default Perfil