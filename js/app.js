let processos = [];

async function carregarDados() {
    try {
        const response = await fetch("dados.json");
        processos = await response.json();
    } catch (erro) {
        console.error("Erro ao carregar JSON:", erro);
    }
}

function buscarProcesso() {
    const termo = document.getElementById("searchInput").value.toLowerCase();
    const resultadoDiv = document.getElementById("resultado");
    
    // Limpa os resultados anteriores
    resultadoDiv.innerHTML = "";

    // Se o campo estiver vazio, não mostra nada
    if (!termo.trim()) return;

    const filtrados = processos.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        (p.palavrasChave && p.palavrasChave.some(chave => chave.toLowerCase().includes(termo)))
    );

    if (filtrados.length === 0) {
        resultadoDiv.innerHTML = "<p style='color: white; text-align: center; grid-column: 1/-1;'>Nenhum processo encontrado.</p>";
        return;
    }

    filtrados.forEach(p => {
        const card = document.createElement("div");
        // AJUSTE: Usando a classe correta do CSS novo
        card.className = "card-processo"; 

        card.innerHTML = `
            <h3>${p.nome}</h3>
            
            <p><strong>Módulo:</strong> ${p.modulo}</p>
            <p><strong>Caminho:</strong> ${p.caminho}</p>

            <div style="margin-top: 15px;">
                <p><strong>Permissões:</strong></p>
                <ul style="margin-bottom: 15px; padding-left: 20px; color: #334155;">
                    ${p.permissoes.map(item => `<li>${item}</li>`).join("")}
                </ul>
            </div>

            <div style="margin-top: 10px;">
                <p><strong>Check List, para análise:</strong></p>
                <ol style="padding-left: 20px; color: #334155; line-height: 1.6;">
                    ${p.checklist.map(item => `<li>${item}</li>`).join("")}
                </ol>
            </div>
            
            <span class="status">Ativo</span>
        `;

        resultadoDiv.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", carregarDados);