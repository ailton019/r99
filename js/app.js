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
        card.className = "card-processo";

        // Processa a descrição para exibir como lista se tiver marcadores
        let descricaoHtml = '';
        if (p.descricao) {
            // Verifica se a descrição contém marcadores de lista
            if (p.descricao.includes('- ') || p.descricao.includes('• ')) {
                const linhas = p.descricao.split('\n');
                const itensLista = linhas.filter(linha => linha.trim().startsWith('-') || linha.trim().startsWith('•'));
                
                if (itensLista.length > 0) {
                    descricaoHtml = '<div class="descricao-container">';
                    descricaoHtml += '<p><strong>DESCRIÇÃO:</strong></p>';
                    descricaoHtml += '<ul class="descricao-lista">';
                    
                    linhas.forEach(linha => {
                        const linhaTrim = linha.trim();
                        if (linhaTrim.startsWith('-') || linhaTrim.startsWith('•')) {
                            // Remove o marcador e exibe como item de lista
                            const texto = linhaTrim.substring(1).trim();
                            descricaoHtml += `<li>${texto}</li>`;
                        } else if (linhaTrim && !linhaTrim.startsWith('-') && !linhaTrim.startsWith('•')) {
                            // Se for texto sem marcador, adiciona como parágrafo normal
                            descricaoHtml += `<p class="descricao-texto">${linhaTrim}</p>`;
                        }
                    });
                    
                    descricaoHtml += '</ul></div>';
                } else {
                    // Se não tiver marcadores, exibe como texto normal
                    descricaoHtml = `
                        <div class="descricao-container">
                            <p><strong>DESCRIÇÃO:</strong></p>
                            <p class="descricao-texto">${p.descricao}</p>
                        </div>
                    `;
                }
            } else {
                // Se não tiver marcadores, exibe como texto normal
                descricaoHtml = `
                    <div class="descricao-container">
                        <p><strong>DESCRIÇÃO:</strong></p>
                        <p class="descricao-texto">${p.descricao}</p>
                    </div>
                `;
            }
        }

        card.innerHTML = `
            <h3>${p.nome}</h3>

            <p><strong>MÓDULO:</strong> ${p.modulo}</p>
            ${p.submodulo ? `<p><strong>SUBMÓDULO:</strong> ${p.submodulo}</p>` : ""}
            
            ${descricaoHtml}

            <p><strong>CAMINHO:</strong> ${p.caminho}</p>

            ${p.preRequisitos && p.preRequisitos.length > 0 ? `
                <div style="margin-top: 10px; width:100%;">
                    <p><strong>PRÉ-REQUISITOS:</strong></p>
                    <ul style="padding-left:20px;">
                        ${p.preRequisitos.map(item => `<li>${item}</li>`).join("")}
                    </ul>
                </div>
            ` : ""}

${p.permissoes && p.permissoes.length > 0 ? `
    <div style="margin-top: 15px; width:100%;">
        <p><strong>PERMISSÕES:</strong></p>
        <ul style="padding-left: 20px;">
            ${p.permissoes.map(item => `<li>${item}</li>`).join("")}
        </ul>
    </div>
` : ""}

            <div style="margin-top: 10px; width:100%;">
                <p><strong>CHECK LIST PARA ANÁLISE:</strong></p>
                <ol style="padding-left: 20px; line-height: 1.6;">
                    ${p.checklist.map(item => `<li>${item}</li>`).join("")}
                </ol>
            </div>

            ${p.manual ? `
                <div style="margin-top:15px; width:100%;">
                    <a href="${p.manual.url}" target="_blank" 
                       style="background:#2563eb; color:white; padding:8px 12px; border-radius:6px; text-decoration:none; display:inline-block;">
                       📘 ${p.manual.titulo}
                    </a>
                </div>
            ` : ""}

            <span class="status">${p.status || "ATIVO"}</span>
        `;

        resultadoDiv.appendChild(card);
    });
}

document.addEventListener("DOMContentLoaded", carregarDados);