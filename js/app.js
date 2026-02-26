let processos = [];

async function carregarDados() {
    try {
        const response = await fetch("dados.json");
        processos = await response.json();
        console.log("Processos carregados:", processos); // Debug
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

    console.log("Processos filtrados:", filtrados); // Debug

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

        // Processa as consultas SQL se existirem
        let consultasSqlHtml = '';
        if (p.consultasSql && p.consultasSql.length > 0) {
            consultasSqlHtml = '<div class="consultas-sql-container" style="margin-top: 20px; width:100%; border-top: 2px solid #4a90ff; padding-top: 15px;">';
            consultasSqlHtml += '<p><strong>📊 CONSULTAS SQL:</strong></p>';
            
            p.consultasSql.forEach((sql, index) => {
                consultasSqlHtml += `
                    <div style="background: #1a1a2e; border-left: 4px solid #4affb5; padding: 12px; margin: 10px 0; border-radius: 0 8px 8px 0;">
                        <p><strong>Consulta ${index + 1} (${sql.tipo || 'SELECT'}):</strong></p>
                        <pre style="background: #0f172a; padding: 10px; border-radius: 5px; overflow-x: auto; color: #4affb5; font-family: 'Courier New', monospace; margin: 10px 0;">${sql.comando}</pre>
                        ${sql.explicacao ? `
                            <p><strong>Explicação:</strong></p>
                            <p style="background: #1e293b; padding: 8px; border-radius: 5px; color: #b28aff; font-style: italic;">${sql.explicacao}</p>
                        ` : ''}
                    </div>
                `;
            });
            
            consultasSqlHtml += '</div>';
        }

        card.innerHTML = `
            <h3>${p.nome} ${p.id ? `<span style="font-size: 0.8rem; color: #4affb5; margin-left: 10px;">ID: ${p.id}</span>` : ''}</h3>

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

            ${p.checklist && p.checklist.length > 0 ? `
                <div style="margin-top: 10px; width:100%;">
                    <p><strong>CHECK LIST PARA ANÁLISE:</strong></p>
                    <ol style="padding-left: 20px; line-height: 1.6;">
                        ${p.checklist.map(item => `<li>${item}</li>`).join("")}
                    </ol>
                </div>
            ` : ""}

            ${consultasSqlHtml}

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

// Função para testar especificamente o ID 4
function testarProcesso4() {
    console.log("=== TESTE DO PROCESSO ID 4 ===");
    
    // Verificar todos os processos carregados
    console.log("Todos os processos:", processos);
    
    // Procurar ID 4
    const processo4 = processos.find(p => p.id === 4);
    
    if (processo4) {
        console.log("✅ Processo ID 4 encontrado:", processo4);
        
        // Verificar especificamente as consultas SQL
        if (processo4.consultasSql) {
            console.log("Consultas SQL do ID 4:", processo4.consultasSql);
            console.log("Número de consultas:", processo4.consultasSql.length);
        } else {
            console.log("❌ Processo ID 4 não tem consultas SQL");
        }
    } else {
        console.log("❌ Processo ID 4 NÃO encontrado!");
        console.log("IDs disponíveis:", processos.map(p => p.id).sort((a,b) => a - b));
    }
}
// Função para atualizar a lista de títulos
function atualizarListaTitulos() {
    const listaContainer = document.getElementById("listaProcessos");
    const contadorSpan = document.getElementById("contadorProcessos");
    
    if (!listaContainer) return; // Se o elemento não existir, sai da função
    
    if (processos.length === 0) {
        listaContainer.innerHTML = '<div class="empty-message">Nenhum processo cadastrado</div>';
        contadorSpan.textContent = '0';
        return;
    }
    
    // Ordena processos por nome
    const processosOrdenados = [...processos].sort((a, b) => 
        a.nome.localeCompare(b.nome)
    );
    
    // Atualiza o contador
    contadorSpan.textContent = processos.length;
    
    // Cria a lista de títulos
    let html = '';
    processosOrdenados.forEach(processo => {
        html += `
            <div class="item-processo-lista" onclick="buscarProcessoPorTitulo('${processo.nome}')">
                <span class="modulo-tag">${processo.modulo || 'Geral'}</span>
                <span>${processo.nome}</span>
            </div>
        `;
    });
    
    listaContainer.innerHTML = html;
}

// Função para buscar quando clicar em um título
function buscarProcessoPorTitulo(titulo) {
    // Preenche o campo de busca com o título
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.value = titulo;
    }
    
    // Chama a função de busca
    buscarProcesso();
    
    // Opcional: scroll até os resultados
    const resultadoDiv = document.getElementById("resultado");
    if (resultadoDiv) {
        resultadoDiv.scrollIntoView({ behavior: 'smooth' });
    }
}

// Modificar a função carregarDados para atualizar a lista automaticamente
async function carregarDados() {
    try {
        const response = await fetch("dados.json");
        processos = await response.json();
        console.log("Processos carregados:", processos);
        
        // Atualiza a lista de títulos após carregar os dados
        atualizarListaTitulos();
        
    } catch (erro) {
        console.error("Erro ao carregar JSON:", erro);
        
        // Se houver erro, mostra mensagem na lista
        const listaContainer = document.getElementById("listaProcessos");
        if (listaContainer) {
            listaContainer.innerHTML = '<div class="empty-message">Erro ao carregar processos</div>';
        }
    }
}
document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    adicionarBotaoTeste();
});
