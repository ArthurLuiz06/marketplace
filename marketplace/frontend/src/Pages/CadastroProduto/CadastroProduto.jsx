import { useState, useEffect } from "react";
import axios from "axios";
import "./CadastroProduto.css";

function CadastroProduto() {

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

  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:3001",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  useEffect(() => {
    carregarCategorias();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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

      await api.post("/produtos", formData);

      alert("Produto cadastrado com sucesso!");

      resetForm();

    } catch (err) {
      console.error("Erro ao salvar produto:", err);
    }
  };

  return (
    <div className="minha-loja">

      <form className="form-produto" onClick={handleSubmit}>

        <h1 className="titulo">Cadastrar Produto</h1>

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

        <button type="submit" className="btn btn-primary">
          Cadastrar Produto
        </button>

      </form>

    </div>
  );
}

export default CadastroProduto;