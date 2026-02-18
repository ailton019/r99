// ========== SISTEMA JASON - GESTÃO DE PROCEDIMENTOS ==========
let procedimentos = [];
let procedimentosFiltrados = [];
let timeoutBuscaJason;

// Carrega dados iniciais
async function carregarProcedimentosJason() {
    try {
        const saved = localStorage.getItem('procedimentosJason');
        
        if (saved) {
            procedimentos = JSON.parse(saved);
            procedimentosFiltrados = [...procedimentos];
            renderizarTabelaJason();
        } else {
            const response = await fetch("dados.json");
            const dados = await response.json();
            
            procedimentos = dados.map((item, index) => ({
                ...item,
                id: item.id || index + 1
            }));
            
            procedimentosFiltrados = [...procedimentos];
            localStorage.setItem('procedimentosJason', JSON.stringify(procedimentos));
            renderizarTabelaJason();
        }
    } catch (error) {
        console.error("Erro ao carregar procedimentos:", error);
        procedimentos = [];
        procedimentosFiltrados = [];
        renderizarTabelaJason();
    }
}

// Função de busca automática na tabela
function buscarNaTabelaJason() {
    clearTimeout(timeoutBuscaJason);
    timeoutBuscaJason = setTimeout(() => {
        const termo = document.getElementById('searchJason')?.value.toLowerCase() || '';
        
        if (!termo) {
            procedimentosFiltrados = [...procedimentos];
        } else {
            procedimentosFiltrados = procedimentos.filter(proc => 
                proc.nome.toLowerCase().includes(termo) ||
                proc.modulo.toLowerCase().includes(termo) ||
                proc.categoria.toLowerCase().includes(termo) ||
                proc.palavrasChave.some(p => p.toLowerCase().includes(termo)) ||
                proc.caminho.toLowerCase().includes(termo)
            );
        }
        
        renderizarTabelaJason();
    }, 300);
}

// Renderiza a tabela de procedimentos
function renderizarTabelaJason() {
    const tbody = document.getElementById('tabelaBody');
    if (!tbody) return;

    tbody.innerHTML = '';
    
    if (procedimentosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px;">Nenhum procedimento encontrado</td></tr>';
        atualizarStatsJason();
        return;
    }

    procedimentosFiltrados.sort((a, b) => a.id - b.id).forEach(proc => {
        const row = tbody.insertRow();
        row.innerHTML = `
            <td>${proc.id}</td>
            <td>
                <strong>${proc.nome}</strong>
                <br>
                <small style="color: #718096;">${(proc.caminho || '').substring(0, 30)}${proc.caminho && proc.caminho.length > 30 ? '...' : ''}</small>
            </td>
            <td>${proc.modulo || 'Não definido'}</td>
            <td>
                <span class="badge-jason ${proc.nivel === 'Alta' ? 'badge-alta' : 'badge-media'}">
                    ${proc.nivel || 'Media'}
                </span>
            </td>
            <td>
                <button class="action-btn btn-view" onclick="visualizarProcedimento(${proc.id})" title="Visualizar">👁️</button>
                <button class="action-btn btn-edit" onclick="editarProcedimento(${proc.id})" title="Editar">✏️</button>
                <button class="action-btn btn-delete" onclick="excluirProcedimento(${proc.id})" title="Excluir">🗑️</button>
            </td>
        `;
    });

    atualizarStatsJason();
}

// Atualiza os cards de estatísticas
function atualizarStatsJason() {
    const statsContainer = document.getElementById('statsContainer');
    if (!statsContainer) return;

    const total = procedimentosFiltrados.length;
    const totalGeral = procedimentos.length;
    const totalMedia = procedimentosFiltrados.filter(p => p.nivel === 'Media').length;
    const totalAlta = procedimentosFiltrados.filter(p => p.nivel === 'Alta').length;
    const modulos = [...new Set(procedimentosFiltrados.map(p => p.modulo).filter(Boolean))].length;

    statsContainer.innerHTML = `
        <div class="stat-card">
            <div class="stat-number">${total}</div>
            <div class="stat-label">Resultados</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${totalMedia}</div>
            <div class="stat-label">Nível Médio</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${totalAlta}</div>
            <div class="stat-label">Nível Alto</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${modulos}</div>
            <div class="stat-label">Módulos</div>
        </div>
    `;
}

// [Todas as outras funções permanecem iguais]
// abrirModalNovo, fecharModal, editarProcedimento, visualizarProcedimento,
// excluirProcedimento, salvarProcedimento, window.onclick

function abrirModalNovo() {
    document.getElementById('modalTitulo').textContent = '📋 Novo Passo a Passo';
    document.getElementById('procedimentoForm').reset();
    document.getElementById('procedimentoId').value = '';
    
    const proximoId = procedimentos.length > 0 
        ? Math.max(...procedimentos.map(p => p.id)) + 1 
        : 1;
    document.getElementById('idDisplay').value = proximoId;
    
    document.getElementById('modalJason').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modalJason').style.display = 'none';
}

function editarProcedimento(id) {
    const proc = procedimentos.find(p => p.id === id);
    if (!proc) return;

    document.getElementById('modalTitulo').textContent = '✏️ Editar Passo a Passo';
    document.getElementById('procedimentoId').value = proc.id;
    document.getElementById('idDisplay').value = proc.id;
    document.getElementById('nome').value = proc.nome || '';
    document.getElementById('modulo').value = proc.modulo || '';
    document.getElementById('categoria').value = proc.categoria || '';
    document.getElementById('nivel').value = proc.nivel || 'Media';
    document.getElementById('palavrasChave').value = (proc.palavrasChave || []).join(', ');
    document.getElementById('caminho').value = proc.caminho || '';
    document.getElementById('permissoes').value = (proc.permissoes || []).join('\n');
    document.getElementById('checklist').value = (proc.checklist || []).join('\n');
    document.getElementById('escalar').value = proc.escalar || '';

    document.getElementById('modalJason').style.display = 'block';
}

function visualizarProcedimento(id) {
    const proc = procedimentos.find(p => p.id === id);
    if (!proc) return;

    const permissoesList = (proc.permissoes || []).map(p => `• ${p}`).join('\n');
    const checklistList = (proc.checklist || []).map(c => `• ${c}`).join('\n');
    
    alert(
        `📋 ${proc.nome}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━\n` +
        `🆔 ID: ${proc.id}\n` +
        `📦 Módulo: ${proc.modulo}\n` +
        `🏷️ Categoria: ${proc.categoria}\n` +
        `📊 Nível: ${proc.nivel}\n` +
        `📍 Caminho: ${proc.caminho}\n\n` +
        `🔑 PERMISSÕES:\n${permissoesList}\n\n` +
        `✅ CHECKLIST:\n${checklistList}\n\n` +
        `⚠️ ESCALAR:\n${proc.escalar}`
    );
}

function excluirProcedimento(id) {
    if (confirm('Tem certeza que deseja excluir este procedimento?')) {
        procedimentos = procedimentos.filter(p => p.id !== id);
        procedimentosFiltrados = procedimentosFiltrados.filter(p => p.id !== id);
        localStorage.setItem('procedimentosJason', JSON.stringify(procedimentos));
        renderizarTabelaJason();
    }
}

function salvarProcedimento() {
    const campos = ['nome', 'modulo', 'categoria', 'palavrasChave', 'caminho', 'permissoes', 'checklist', 'escalar'];
    for (let campo of campos) {
        if (!document.getElementById(campo).value.trim()) {
            alert(`O campo ${campo} é obrigatório!`);
            document.getElementById(campo).focus();
            return;
        }
    }

    const id = document.getElementById('procedimentoId').value;
    
    const palavrasChave = document.getElementById('palavrasChave').value
        .split(',')
        .map(item => item.trim())
        .filter(item => item);

    const permissoes = document.getElementById('permissoes').value
        .split('\n')
        .map(item => item.trim())
        .filter(item => item);

    const checklist = document.getElementById('checklist').value
        .split('\n')
        .map(item => item.trim())
        .filter(item => item);

    const procedimento = {
        id: id ? parseInt(id) : parseInt(document.getElementById('idDisplay').value),
        nome: document.getElementById('nome').value.trim(),
        modulo: document.getElementById('modulo').value,
        categoria: document.getElementById('categoria').value.trim(),
        nivel: document.getElementById('nivel').value,
        palavrasChave: palavrasChave,
        caminho: document.getElementById('caminho').value.trim(),
        permissoes: permissoes,
        checklist: checklist,
        escalar: document.getElementById('escalar').value.trim()
    };

    if (id) {
        const index = procedimentos.findIndex(p => p.id === parseInt(id));
        if (index !== -1) {
            procedimentos[index] = procedimento;
        }
    } else {
        procedimentos.push(procedimento);
    }

    procedimentos.sort((a, b) => a.id - b.id);
    procedimentosFiltrados = [...procedimentos];
    localStorage.setItem('procedimentosJason', JSON.stringify(procedimentos));
    
    renderizarTabelaJason();
    fecharModal();
    alert('Procedimento salvo com sucesso!');
}

window.onclick = function(event) {
    const modal = document.getElementById('modalJason');
    if (event.target === modal) {
        fecharModal();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    carregarProcedimentosJason();
});