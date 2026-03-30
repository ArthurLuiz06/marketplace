import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CriarLoja.css";

function CriarLoja() {
    const navigate = useNavigate();

    const [etapa, setEtapa] = useState(1);

    const [form, setForm] = useState({
        nome_loja: "",
        descricao: "",
        rua: "",
        numero: "",
        bairro: "",
        cidade: "",
        estado: "",
        cep: "",
    });

    const [erros, setErros] = useState({});
    const [loading, setLoading] = useState(false);
    const [animacao, setAnimacao] = useState("direita");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErros({ ...erros, [e.target.name]: "" });
    };

    // 🔥 VALIDAÇÃO POR ETAPA
    const validarEtapa1 = () => {
        let novosErros = {};

        if (!form.nome_loja) {
            novosErros.nome_loja = "Nome obrigatório";
        }

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const validarEtapa2 = () => {
        let novosErros = {};

        if (!form.rua) novosErros.rua = "Rua obrigatória";
        if (!form.numero) novosErros.numero = "Número obrigatório";
        if (!form.cidade) novosErros.cidade = "Cidade obrigatória";
        if (!form.estado) novosErros.estado = "Estado obrigatório";
        if (!form.cep || form.cep.length < 8)
            novosErros.cep = "CEP inválido";

        setErros(novosErros);
        return Object.keys(novosErros).length === 0;
    };

    const proximo = () => {
        if (!validarEtapa1()) return;
        setAnimacao("direita");
        setEtapa(2);
    };

    const voltar = () => {
        setAnimacao("esquerda");
        setEtapa(1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validarEtapa2()) return;

        setLoading(true);

        const token = localStorage.getItem("token");

        try {
            const res = await fetch("http://localhost:3000/lojas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    nome_loja: form.nome_loja,
                    descricao: form.descricao,
                    endereco: {
                        rua: form.rua,
                        numero: form.numero,
                        bairro: form.bairro,
                        cidade: form.cidade,
                        estado: form.estado,
                        cep: form.cep,
                    },
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error);

            alert("Loja criada com sucesso!");
            navigate("/");

        } catch (err) {
            alert(err.message);
        }

        setLoading(false);
    };

    const inputClass = (campo) => {
        if (erros[campo]) return "input-error";
        if (form[campo]) return "input-success";
        return "";
    };

    return (
        <div className="container">
            <div className="cadastro-box">
                <form onSubmit={handleSubmit}>
                    <h2>Cadastrar Loja</h2>

                    {/*  PROGRESS BAR */}
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{ width: etapa === 1 ? "50%" : "100%" }}
                        ></div>
                    </div>

                    {/* ETAPA 1 */}
                    {etapa === 1 && (
                        <div className={`step1 ${animacao}`}>
                            <input
                                name="nome_loja"
                                value={form.nome_loja}
                                placeholder="Nome da loja"
                                onChange={handleChange}
                                className={inputClass("nome_loja")}
                            />
                            {erros.nome_loja && <span className="erro">{erros.nome_loja}</span>}

                            <input
                                name="descricao"
                                placeholder="Descrição (opcional)"
                                value={form.descricao}
                                onChange={handleChange}
                            />

                            <button type="button" onClick={proximo}>
                                Próximo
                            </button>
                        </div>
                    )}

                    {/* ETAPA 2 */}
                    {etapa === 2 && (
                        <div className={`step2 ${animacao}`}>
                            <input name="rua" value={form.rua} placeholder="Rua" onChange={handleChange} className={inputClass("rua")} />
                            {erros.rua && <span className="erro">{erros.rua}</span>}

                            <input name="numero" value={form.numero} placeholder="Número" onChange={handleChange} className={inputClass("numero")} />
                            {erros.numero && <span className="erro">{erros.numero}</span>}

                            <input name="bairro" value={form.bairro} placeholder="Bairro" onChange={handleChange} />

                            <input name="cidade" value={form.cidade} placeholder="Cidade" onChange={handleChange} className={inputClass("cidade")} />
                            {erros.cidade && <span className="erro">{erros.cidade}</span>}

                            <input name="estado" value={form.estado} placeholder="Estado" onChange={handleChange} className={inputClass("estado")} />
                            {erros.estado && <span className="erro">{erros.estado}</span>}

                            <input name="cep" value={form.cep} placeholder="CEP" onChange={handleChange} className={inputClass("cep")} />
                            {erros.cep && <span className="erro">{erros.cep}</span>}

                            <div className="button-group">

                                    <button type="button" onClick={voltar}>
                                        Voltar
                                    </button>

                                <button type="submit" disabled={loading}>
                                    {loading ? "Criando..." : "Cadastrar Loja"}
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default CriarLoja;