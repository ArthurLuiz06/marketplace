import { useState, useEffect } from "react";
import axios from "axios";
// import "./MinhaLoja.css";

function MinhaLoja() {

  const [produtos, setProdutos] = useState([]);
  const [categorias, setCategorias] = useState([]);

  const [form, setForm] = useState({
    nome: "",
    descricao: "",
    preco: "",
    estoque: "",
    categoria: "",
  });

  const [imagem, setImagem] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editandoId, setEditandoId] = useState(null);

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    carregarProdutos();
    carregarCategorias();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const carregarProdutos = async () => {
    try {
      const res = await api.get("/produtos");
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
    }
  };

  const carregarCategorias = async () => {
    try {
      const res = await api.get("/categorias");
      setCategorias(res.data);
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };

  const handleImagem = (e) => {
    const file = e.target.files[0];
    setImagem(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setForm({
      nome: "",
      descricao: "",
      preco: "",
      estoque: "",
      categoria: "",
    });
    setImagem(null);
    setPreview(null);
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("nome_produto", form.nome);
      formData.append("descricao", form.descricao);
      formData.append("preco", form.preco);
      formData.append("estoque", form.estoque);
      formData.append("id_categoria", form.categoria);

      if (imagem) {
        formData.append("imagem", imagem);
      }

      if (editandoId) {
        await api.put(`/produtos/${editandoId}`, formData);
      } else {
        await api.post("/produtos", formData);
      }

      resetForm();
      carregarProdutos();

    } catch (err) {
      console.error("Erro ao salvar produto:", err);
    }
  };

  const handleEditar = (prod) => {
    setForm({
      nome: prod.nome_produto,
      descricao: prod.descricao,
      preco: prod.preco,
      estoque: prod.estoque,
      categoria: prod.id_categoria,
    });

    setPreview(`http://localhost:3001/uploads/${prod.imagem}`);
    setEditandoId(prod.id_produto);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja deletar?")) return;

    try {
      await api.delete(`/produtos/${id}`);
      carregarProdutos();
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  return (
    <div className="minha-loja">

      <h1 className="titulo">Minha Loja</h1>

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} className="form-produto">

        <input
          type="text"
          name="nome"
          placeholder="Nome do produto"
          value={form.nome}
          onChange={handleChange}
          className="input"
          required
        />

        <textarea
          name="descricao"
          placeholder="Descrição"
          value={form.descricao}
          onChange={handleChange}
          className="input"
        />

        <input
          type="number"
          name="preco"
          placeholder="Preço"
          value={form.preco}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          type="number"
          name="estoque"
          placeholder="Estoque"
          value={form.estoque}
          onChange={handleChange}
          className="input"
          required
        />

        <select
          name="categoria"
          value={form.categoria}
          onChange={handleChange}
          className="input"
          required
        >
          <option value="">Selecione a categoria</option>

          {categorias.map((cat) => (
            <option key={cat.id_categoria} value={cat.id_categoria}>
              {cat.nome_categoria}
            </option>
          ))}
        </select>

        <input
          type="file"
          onChange={handleImagem}
          className="input-file"
        />

        {preview && (
          <img
            src={preview}
            alt="preview"
            className="preview-imagem"
          />
        )}

        <div className="botoes-form">

          <button type="submit" className="btn btn-primary">
            {editandoId ? "Atualizar Produto" : "Cadastrar Produto"}
          </button>

          {editandoId && (
            <button
              type="button"
              onClick={resetForm}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
          )}

        </div>

      </form>

      {/* LISTA */}
      <div className="lista-produtos">

        {produtos.map((prod) => (
          <div key={prod.id_produto} className="card-produto">

            <img
              src={`http://localhost:3001/uploads/${prod.imagem}`}
              alt={prod.nome_produto}
              className="imagem-produto"
            />

            <h2 className="nome-produto">{prod.nome_produto}</h2>
            <p className="preco-produto">R$ {prod.preco}</p>

            <div className="acoes-produto">

              <button
                onClick={() => handleEditar(prod)}
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
        ))}

      </div>

    </div>
  );
}

export default MinhaLoja;