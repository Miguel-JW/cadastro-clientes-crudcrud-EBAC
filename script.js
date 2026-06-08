// =============================================
// ATENÇÃO: Substitua pela sua URL do CrudCrud
// Acesse https://crudcrud.com e copie sua URL
// Exemplo: https://crudcrud.com/api/SEU_TOKEN
// =============================================
const BASE_URL = 'https://crudcrud.com/api/SEU_TOKEN_AQUI/clientes';

const formCliente    = document.getElementById('formCliente');
const inputNome      = document.getElementById('nome');
const inputEmail     = document.getElementById('email');
const listaClientes  = document.getElementById('listaClientes');
const mensagem       = document.getElementById('mensagem');
const avisoVazio     = document.getElementById('vazio');

// ── Utilitários ──────────────────────────────

function exibirMensagem(texto, tipo = 'sucesso') {
  mensagem.textContent = texto;
  mensagem.className = tipo;
  setTimeout(() => { mensagem.textContent = ''; mensagem.className = ''; }, 3000);
}

function toggleVazio() {
  avisoVazio.style.display =
    listaClientes.children.length === 0 ? 'block' : 'none';
}

// ── GET — Listar clientes ─────────────────────

async function listarClientes() {
  listaClientes.innerHTML = '';
  try {
    const res  = await fetch(BASE_URL);
    const data = await res.json();

    console.log('[GET] Clientes recebidos:', data);

    data.forEach(cliente => renderCliente(cliente));
    toggleVazio();
  } catch (err) {
    console.error('[GET] Erro ao listar clientes:', err);
    exibirMensagem('Erro ao carregar clientes.', 'erro');
  }
}

// ── POST — Cadastrar cliente ──────────────────

async function cadastrarCliente(nome, email) {
  try {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email })
    });

    const novoCliente = await res.json();
    console.log('[POST] Cliente criado:', novoCliente);

    renderCliente(novoCliente);
    toggleVazio();
    exibirMensagem('Cliente cadastrado com sucesso!');
  } catch (err) {
    console.error('[POST] Erro ao cadastrar cliente:', err);
    exibirMensagem('Erro ao cadastrar cliente.', 'erro');
  }
}

// ── DELETE — Excluir cliente ──────────────────

async function excluirCliente(id, itemEl) {
  try {
    await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    console.log('[DELETE] Cliente removido:', id);

    itemEl.classList.add('removendo');
    itemEl.addEventListener('animationend', () => {
      itemEl.remove();
      toggleVazio();
    });

    exibirMensagem('Cliente removido com sucesso!');
  } catch (err) {
    console.error('[DELETE] Erro ao excluir cliente:', err);
    exibirMensagem('Erro ao excluir cliente.', 'erro');
  }
}

// ── Renderizar item na lista ──────────────────

function renderCliente(cliente) {
  const li = document.createElement('li');
  li.className = 'cliente-item';
  li.innerHTML = `
    <div class="info">
      <span class="nome">${cliente.nome}</span>
      <span class="email">${cliente.email}</span>
    </div>
    <button class="btn-excluir" title="Excluir cliente">✕</button>
  `;

  li.querySelector('.btn-excluir').addEventListener('click', () => {
    excluirCliente(cliente._id, li);
  });

  listaClientes.appendChild(li);
}

// ── Submit do formulário ──────────────────────

formCliente.addEventListener('submit', async (e) => {
  e.preventDefault();
  const nome  = inputNome.value.trim();
  const email = inputEmail.value.trim();
  if (!nome || !email) return;

  await cadastrarCliente(nome, email);
  formCliente.reset();
  inputNome.focus();
});

// ── Inicializar ───────────────────────────────

listarClientes();
