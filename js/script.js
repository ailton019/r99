let dados = [];
let timeoutBusca;

async function carregarDados() {
    try {
        const response = await fetch("dados.json");
        dados = await response.json();
        // Se quiser mostrar todos ao carregar, descomente a linha abaixo
        // mostrarTodosResultados();
    } catch (error) {
        console.error("Erro ao carregar dados:", error);
    }
}

// Função de busca automática
function buscarRotinaAutomatico() {
    clearTimeout(timeoutBusca);
    timeoutBusca = setTimeout(() => {
        buscarRotina();
    }, 300); // Espera 300ms após parar de digitar
}

// Função principal de busca
function buscarRotina() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const resultadoDiv = document.getElementById("resultado");

    // Se o input estiver vazio, limpa os resultados
    if (!input) {
        resultadoDiv.innerHTML = ""; // Limpa a div
        return;
    }

    // Filtra os resultados
    const resultados = dados.filter(r => 
        r.nome.toLowerCase().includes(input) ||
        r.modulo.toLowerCase().includes(input) ||
        r.categoria.toLowerCase().includes(input) ||
        r.palavrasChave.some(p => p.toLowerCase().includes(input)) ||
        r.caminho.toLowerCase().includes(input)
    );

    if (resultados.length === 0) {
        resultadoDiv.innerHTML = "<p class='sem-resultados'>Nenhuma rotina encontrada.</p>";
        return;
    }

    // Mostra os resultados
    resultadoDiv.innerHTML = resultados.map(rotina => `
        <div class="card" onclick="visualizarRotina(${rotina.id})">
            <h2>${rotina.nome}</h2>
            <p><strong>📦 Módulo:</strong> ${rotina.modulo}</p>
            <p><strong>📍 Caminho:</strong> ${rotina.caminho}</p>
            <p><strong>🏷️ Categoria:</strong> ${rotina.categoria}</p>
            <p><strong>📊 Nível:</strong> <span class="nivel-${rotina.nivel.toLowerCase()}">${rotina.nivel}</span></p>
            <p><strong>🔑 Palavras-chave:</strong> ${rotina.palavrasChave.join(', ')}</p>
            <button class="btn-visualizar" onclick="visualizarRotina(${rotina.id}); event.stopPropagation();">Ver detalhes</button>
        </div>
    `).join("");
}

// Função para visualizar rotina completa
function visualizarRotina(id) {
    const rotina = dados.find(r => r.id === id);
    if (!rotina) return;

    const permissoesList = rotina.permissoes.map(p => `• ${p}`).join('\n');
    const checklistList = rotina.checklist.map(c => `• ${c}`).join('\n');
    
    alert(
        `📋 ${rotina.nome}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `📦 Módulo: ${rotina.modulo}\n` +
        `🏷️ Categoria: ${rotina.categoria}\n` +
        `📊 Nível: ${rotina.nivel}\n` +
        `📍 Caminho: ${rotina.caminho}\n\n` +
        `🔑 PERMISSÕES:\n${permissoesList}\n\n` +
        `✅ CHECKLIST:\n${checklistList}\n\n` +
        `⚠️ ESCALAR:\n${rotina.escalar}`
    );
}

// Função opcional para mostrar todos os resultados inicialmente
function mostrarTodosResultados() {
    if (dados.length > 0) {
        const resultadoDiv = document.getElementById("resultado");
        resultadoDiv.innerHTML = dados.map(rotina => `
            <div class="card" onclick="visualizarRotina(${rotina.id})">
                <h2>${rotina.nome}</h2>
                <p><strong>📦 Módulo:</strong> ${rotina.modulo}</p>
                <p><strong>📍 Caminho:</strong> ${rotina.caminho}</p>
                <button class="btn-visualizar" onclick="visualizarRotina(${rotina.id}); event.stopPropagation();">Ver detalhes</button>
            </div>
        `).join("");
    }
}

window.onload = carregarDados;