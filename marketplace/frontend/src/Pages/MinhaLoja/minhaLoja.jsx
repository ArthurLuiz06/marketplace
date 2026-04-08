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
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await api.get("/produtos");
      setProdutos(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar?")) return;

    try {
      await api.delete(`/produtos/${id}`);
      carregarProdutos();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="minha-loja">

      {/* TOPO LIMPO */}
      <h1 className="titulo">Minha Loja</h1>

      {/* DASHBOARD */}
      <div className="dashboard-cards">
        <div className="card-info">
          <h3>Total de Produtos</h3>
          <p>{produtos.length}</p>
        </div>

        <div className="card-info">
          <h3>Vendas</h3>
          <p>Em breve</p>
        </div>
      </div>

      {/* 🔥 BOTÃO PRINCIPAL (POSIÇÃO IDEAL) */}
      <div className="acao-principal">
        <button
          className="btn-primary"
          onClick={() => navigate("/minha-loja/novo-produto")}
        >
          + Cadastrar Produto
        </button>
      </div>

      {/* LISTA */}
      <div className="lista-produtos">
        {produtos.length === 0 ? (
          <p className="sem-produto">Nenhum produto cadastrado</p>
        ) : (
          produtos.map((prod) => (
            <div key={prod.id_produto} className="card-produto">

              <img
                src={
                  prod.imagem
                    ? `http://localhost:3001/uploads/${prod.imagem}`
                    : "https://via.placeholder.com/150"
                }
                alt={prod.nome_produto}
                className="imagem-produto"
              />

              <h2 className="nome-produto">{prod.nome_produto}</h2>
              <p className="preco-produto">R$ {prod.preco}</p>

              <div className="acoes-produto">

                <button
                  onClick={() => navigate(`/minha-loja/editar/${prod.id_produto}`)}
                  className="btn btn-edit"
                >
                  Editar
                </button>

                <button
                  onClick={() => handleDelete(prod.id_produto)}
                  className="btn btn-delete"
                >
                  Deletar
                </button>

              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}

export default MinhaLoja;