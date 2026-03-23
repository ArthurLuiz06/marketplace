import { useLocation } from "react-router-dom";

function Home() {
    const location = useLocation();

    const nome = location.state?.nome;

    return(
        <div>
            <h1>Bem vindo, {nome}</h1>
        </div>
    )
}


export default Home