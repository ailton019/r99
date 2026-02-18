let dados = [];

async function carregarDados() {
    const response = await fetch("dados.json");
    dados = await response.json();
}

function buscarRotina() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const resultadoDiv = document.getElementById("resultado");

    if (!input) {
        resultadoDiv.innerHTML = "<p>Digite algo para pesquisar.</p>";
        return;
    }

    const resultados = dados.filter(r => 
        r.nome.toLowerCase().includes(input) ||
        r.modulo.toLowerCase().includes(input) ||
        r.palavrasChave.some(p => p.includes(input))
    );

    if (resultados.length === 0) {
        resultadoDiv.innerHTML = "<p>Nenhuma rotina encontrada.</p>";
        return;
    }

    resultadoDiv.innerHTML = resultados.map(rotina => `
        <div class="card">
            <h2>${rotina.nome}</h2>
            <p><strong>Módulo:</strong> ${rotina.modulo}</p>
            <p><strong>Caminho:</strong> ${rotina.caminho}</p>

            <h3>Permissões:</h3>
            <ul>${rotina.permissoes.map(p => `<li>${p}</li>`).join("")}</ul>

            <h3>Checklist N1:</h3>
            <ul>${rotina.checklist.map(c => `<li>${c}</li>`).join("")}</ul>

            <p><strong>Escalonamento:</strong> ${rotina.escalar}</p>
        </div>
    `).join("");
}

window.onload = carregarDados;
