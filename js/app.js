let processos = [];

// Função principal para carregar dados
async function carregarDados() {
    try {
        const response = await fetch("dados.json");
        processos = await response.json();
        console.log("Processos carregados:", processos.length);
        
        atualizarListaTitulos();
        atualizarPainelEstatisticas();
        
    } catch (erro) {
        console.error("Erro ao carregar JSON:", erro);
        mostrarErro();
    }
}

// Atualizar painel de estatísticas - CONTAGEM POR MÓDULO
function atualizarPainelEstatisticas() {
    // Inicializar contadores
    const modulos = {
        faturamento: 0,
        compras: 0,
        estoque: 0,
        empresa: 0,
        sql: 0,
        outros: 0
    };
    
    // Contar processos por módulo
    processos.forEach(processo => {
        const modulo = (processo.modulo || '').toLowerCase().trim();
        
        if (modulo.includes('faturamento')) {
            modulos.faturamento++;
        } 
        else if (modulo.includes('compras') || modulo.includes('devolução de compra')) {
            modulos.compras++;
        }
        else if (modulo.includes('estoque')) {
            modulos.estoque++;
        }
        else if (modulo.includes('empresa')) {
            modulos.empresa++;
        }
        else if (modulo.includes('sql') || modulo.trim() === 'sql') {
            modulos.sql++;
        }
        else {
            // Se tiver módulo mas não se encaixar nas categorias acima
            if (modulo && modulo !== '') {
                modulos.outros++;
            }
        }
    });
    
    // Atualizar DOM com os contadores
    document.getElementById('totalProcessos').textContent = processos.length;
    document.getElementById('totalFaturamento').textContent = modulos.faturamento;
    document.getElementById('totalCompras').textContent = modulos.compras;
    document.getElementById('totalEstoque').textContent = modulos.estoque;
    document.getElementById('totalEmpresa').textContent = modulos.empresa;
    document.getElementById('totalSQL').textContent = modulos.sql;
    document.getElementById('totalOutros').textContent = modulos.outros;
    
    // Debug para verificar a contagem
    console.log('Contagem por módulo:', modulos);
    console.log('Total de processos:', processos.length);
}

// Função para criar card de processo (adaptada para remover valor)
function criarCardProcesso(processo, container) {
    const card = document.createElement("div");
    card.className = "card-processo";

    let descricaoHtml = processarDescricao(processo.descricao);
    let consultasSqlHtml = processarConsultasSQL(processo.consultasSql);

    card.innerHTML = `
        <h3>${processo.nome}</h3>
        <p><strong>MÓDULO:</strong> ${processo.modulo || 'Não especificado'}</p>
        ${processo.submodulo ? `<p><strong>SUBMÓDULO:</strong> ${processo.submodulo}</p>` : ""}
        ${descricaoHtml}
        <p><strong>CAMINHO:</strong> ${processo.caminho || 'Não informado'}</p>
        ${processarLista('PRÉ-REQUISITOS', processo.preRequisitos)}
        ${processarLista('PERMISSÕES', processo.permissoes)}
        ${processarLista('CHECK LIST', processo.checklist, 'ol')}
        ${consultasSqlHtml}
        ${processo.manual ? criarLinkManual(processo.manual) : ""}
        <span class="status">${processo.status || "ATIVO"}</span>
    `;

    container.appendChild(card);
}

// Função para processar descrição (mantida igual)
function processarDescricao(descricao) {
    if (!descricao) return '';
    
    if (descricao.includes('- ') || descricao.includes('• ')) {
        const linhas = descricao.split('\n');
        const itensLista = linhas.filter(l => l.trim().startsWith('-') || l.trim().startsWith('•'));
        
        if (itensLista.length > 0) {
            let html = '<div class="descricao-container"><p><strong>DESCRIÇÃO:</strong></p><ul>';
            linhas.forEach(linha => {
                const linhaTrim = linha.trim();
                if (linhaTrim.startsWith('-') || linhaTrim.startsWith('•')) {
                    html += `<li>${linhaTrim.substring(1).trim()}</li>`;
                } else if (linhaTrim && !linhaTrim.startsWith('-') && !linhaTrim.startsWith('•')) {
                    html += `<p class="descricao-texto">${linhaTrim}</p>`;
                }
            });
            html += '</ul></div>';
            return html;
        }
    }
    
    return `<div class="descricao-container"><p><strong>DESCRIÇÃO:</strong></p><p>${descricao.replace(/\n/g, '<br>')}</p></div>`;
}

// Função para processar consultas SQL (mantida igual)
function processarConsultasSQL(consultas) {
    if (!consultas || !consultas.length) return '';
    
    let html = '<div class="consultas-sql-container" style="margin-top:20px; border-top:1px solid #4a90ff; padding-top:15px;">';
    html += '<p><strong>📊 CONSULTAS SQL:</strong></p>';
    
    consultas.forEach((sql, i) => {
        html += `
            <div style="background:#1a1a2e; border-left:3px solid #4affb5; padding:12px; margin:10px 0; border-radius:0 8px 8px 0;">
                <p><strong>Consulta ${i+1} (${sql.tipo || 'SELECT'}):</strong></p>
                <pre style="background:#0f172a; padding:10px; overflow-x:auto; color:#4affb5; font-family:monospace; border-radius:4px;">${sql.comando}</pre>
                ${sql.explicacao ? `<p style="color:#b28aff; margin-top:8px; font-style:italic;">${sql.explicacao}</p>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

// Função para processar listas (mantida igual)
function processarLista(titulo, itens, tipo = 'ul') {
    if (!itens || !itens.length) return '';
    
    const tag = tipo === 'ol' ? 'ol' : 'ul';
    const itensHtml = itens.map(item => `<li>${item}</li>`).join('');
    
    return `
        <div style="margin-top:15px;">
            <p><strong>${titulo}:</strong></p>
            <${tag} style="padding-left:20px; line-height:1.6;">${itensHtml}</${tag}>
        </div>
    `;
}

// Função para criar link manual (mantida igual)
function criarLinkManual(manual) {
    return `
        <div style="margin-top:15px;">
            <a href="${manual.url}" target="_blank" 
               style="background:#2563eb; color:white; padding:8px 12px; border-radius:6px; text-decoration:none; display:inline-block;">
               📘 ${manual.titulo}
            </a>
        </div>
    `;
}

// Função de busca principal
function buscarProcesso() {
    const termo = document.getElementById("searchInput").value.toLowerCase().trim();
    const resultadoDiv = document.getElementById("resultado");
    
    resultadoDiv.innerHTML = "";

    if (!termo) return;

    const filtrados = processos.filter(p =>
        p.nome.toLowerCase().includes(termo) ||
        (p.palavrasChave && p.palavrasChave.some(chave => 
            chave && chave.toLowerCase().includes(termo)
        )) ||
        (p.modulo && p.modulo.toLowerCase().includes(termo)) ||
        (p.descricao && p.descricao.toLowerCase().includes(termo))
    );

    if (filtrados.length === 0) {
        resultadoDiv.innerHTML = "<p class='empty-message' style='grid-column: 1/-1; text-align:center; padding:2rem;'>Nenhum processo encontrado.</p>";
        return;
    }

    filtrados.forEach(p => criarCardProcesso(p, resultadoDiv));
}

// Atualizar lista de títulos
function atualizarListaTitulos() {
    const listaContainer = document.getElementById("listaProcessos");
    const contadorSpan = document.getElementById("contadorProcessos");
    
    if (!listaContainer) return;
    
    if (processos.length === 0) {
        listaContainer.innerHTML = '<div class="empty-message">Nenhum processo cadastrado</div>';
        contadorSpan.textContent = '0';
        return;
    }
    
    const processosOrdenados = [...processos].sort((a, b) => a.nome.localeCompare(b.nome));
    contadorSpan.textContent = processos.length;
    
    listaContainer.innerHTML = processosOrdenados.map(processo => `
        <div class="item-processo-lista" onclick="buscarPorTitulo('${processo.nome.replace(/'/g, "\\'")}')">
            <span class="modulo-tag">${processo.modulo || 'Geral'}</span>
            <span>${processo.nome}</span>
        </div>
    `).join('');
}

// Buscar por título
function buscarPorTitulo(titulo) {
    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.value = titulo;
        buscarProcesso();
        
        const resultadoDiv = document.getElementById("resultado");
        if (resultadoDiv) {
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}

// Mostrar erro
function mostrarErro() {
    const listaContainer = document.getElementById("listaProcessos");
    if (listaContainer) {
        listaContainer.innerHTML = '<div class="empty-message">Erro ao carregar processos</div>';
    }
    
    // Zerar estatísticas em caso de erro
    document.getElementById('totalProcessos').textContent = '0';
    document.getElementById('totalFaturamento').textContent = '0';
    document.getElementById('totalCompras').textContent = '0';
    document.getElementById('totalEstoque').textContent = '0';
    document.getElementById('totalEmpresa').textContent = '0';
    document.getElementById('totalSQL').textContent = '0';
    document.getElementById('totalOutros').textContent = '0';
}

// Inicialização
document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
});

// Expor funções globais necessárias
window.buscarProcesso = buscarProcesso;
window.buscarPorTitulo = buscarPorTitulo;