import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MinhaLoja.css";

function MinhaLoja() {
  const [produtos, setProdutos] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:3001",
  });

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await api.get("/produtos/minha-loja", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProdutos(res.data.data || []);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar?")) return;

    try {
      await api.delete(`/produtos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      carregarProdutos();
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  return (
    <div className="minha-loja-container">

      {/* 🔥 HEADER FIXO */}
      <div className="header-loja">

        <h1 className="titulo">Minha Loja</h1>

        <div className="topo-linha">

          <div className="cards-dashboard">

            <div className="card-info">
              <span>Produtos</span>
              <strong>{produtos.length}</strong>
            </div>

            <div className="card-info">
              <span>Faturamento</span>
              <strong>R$ 0,00</strong>
            </div>

            <div className="card-info">
              <span>Estoque</span>
              <strong>
                {produtos.reduce((total, p) => total + Number(p.estoque || 0), 0)}
              </strong>
            </div>

          </div>

          <button
            className="btn-primary btn-small"
            onClick={() => navigate("/minha-loja/novo-produto")}
          >
            + Produto
          </button>

        </div>

      </div>
      {/* 🔥 CONTEÚDO (PRODUTOS) */}
      <div className="conteudo-loja">

        <div className="lista-produtos">
          {produtos.length === 0 ? (
            <p className="sem-produto">Nenhum produto cadastrado</p>
          ) : (
            produtos.map((prod) => (
              <div key={prod.id_produto} className="card-produto">

                {/* IMAGEM */}
                <div className="imagem-container">
                  <img
                    src={prod.imagem_url || "https://via.placeholder.com/300"}
                    alt={prod.nome_produto}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                  />
                </div>

                {/* CONTEÚDO */}
                <div className="conteudo-produto">

                  <h2 className="nome-produto">
                    {prod.nome_produto}
                  </h2>

                  <p className="descricao-produto">
                    {prod.descricao || "Sem descrição"}
                  </p>

                  <p className="preco-produto">
                    R$ {Number(prod.preco).toFixed(2)}
                  </p>

                  <div className="acoes-produto">

                    <button
                      className="btn-edit"
                      onClick={() =>
                        navigate(`/minha-loja/editar/${prod.id_produto}`)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(prod.id_produto)}
                    >
                      Deletar
                    </button>

                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}

export default MinhaLoja;