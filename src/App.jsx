import { useState } from "react";
import axios from "axios";
import "./css/app.css";
import "./css/resposividade.css"



function App() {
  const [domain, setDomain] = useState();
  const [domainCopy, setDomainCopy] = useState();
  const [domainData, setDomainData] = useState();
  const [statusText, setStatusText] = useState();
  const [colorStatus, setColorStatus] = useState();

  async function verificarDominio() {
    if (!domain) {
      alert("Preencha o campo corretamente!");
      return null;
    }

    try {
      const domainReq = await axios.get(
        `https://brasilapi.com.br/api/registrobr/v1/${domain}`
      );

      const data = domainReq.data;
      setDomainData(data);
      setDomainCopy(domain);

      verificarStatus(data.status);

      console.log("Dados Recebidos:", data);
    } catch (err) {
      console.error("Erro ao fazer requisição:", err);
    }
  }

  function verificarStatus(domain) {
    if (domain == "REGISTERED" || domain == "UNAVAILABLE") {
      setStatusText("não disponível");
      setColorStatus("#df2626");
    } else {
      setStatusText("disponivel");
      setColorStatus("green");
    }
  }

  return (
    <>
      <header>
        <h1 className="logo">Domínio.Br</h1>
      </header>

      <main>
        <section className="containerSearch">
        <span>Verifique a disponibilidade de um domínio .br de forma fácil e rápida.</span>
          <div className="containerInputs">
            <input
              type="text"
              className="inputDomain"
              id="inputDomain"
              value={domain}
              placeholder="Verificar Domínio"
              onChange={(e) => {
                setDomain(e.target.value);
              }}
            />
            <button
              className="btnSearch"
              type="button"
              onClick={verificarDominio}
            ></button>
          </div>
        </section>
        {domainData && (
          <section className="containerInfDomain">
            <div className="containerStatus">
              <p className="pDomain">{domainData.fqdn}</p>
              <p className="pStatus">
                Dominío
                <span style={{ color: colorStatus }}>
                  {" "}
                  <strong>{statusText}</strong> para registro.
                </span>
              </p>
            </div>
            <div className="divP">
              <p>
                {" "}
                {domainData.reasons ||
                  (domainData.status === "REGISTERED"
                    ? "Domínio já registrado"
                    : "Domínio não registrado")}{" "}
              </p>
            </div>
            {Array.isArray(domainData.suggestions) && (
              <div className="containerSuggestions">
                <h3>Sugestões Disponíveis</h3>

                <div className="suggestions">
                  {domainData.suggestions.map((suggestion, i) => (
                    <p key={i}>
                      {domainCopy}.<strong>{suggestion}</strong>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}

export default App;
