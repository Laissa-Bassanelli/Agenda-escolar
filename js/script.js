// -------------------- CONTROLE DE PÁGINAS --------------------
function showPage(pageId) {
  document.querySelectorAll("section").forEach(sec => sec.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");

  // Renderizações específicas
  if (pageId === "agenda") renderAgenda();
  if (pageId === "alunos") renderAlunos();
  if (pageId === "tarefas") renderTarefas();
}

// -------------------- LOGIN E CADASTRO --------------------
function login(event) {
  event.preventDefault(); // evita reload do form
  const usuario = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  if(!Array.isArray(usuarios)) usuarios = [];

  const user = usuarios.find(u => u.usuario === usuario && u.senha === senha);

  if(user){
  localStorage.setItem("usuario", JSON.stringify(user));
  document.querySelector("nav").style.display = "flex"; // mostra menu
  document.getElementById("nomeUsuarioMenu").textContent = user.nome || user.usuario;
  showPage("agenda");
 } else {
    showMessage("Usuário ou senha inválidos!");
  }
}

function cadastrar(event){
  event.preventDefault();
  const usuario = document.getElementById("cadEmail").value;
  const senha = document.getElementById("cadSenha").value;
  const nome = document.getElementById("cadNome").value;
  const confirmar = document.getElementById("cadConfirma").value;

  if(senha !== confirmar){
    showMessage("As senhas não coincidem!");
    return;
  }

  let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  if(!Array.isArray(usuarios)) usuarios = [];

  if(usuarios.find(u => u.usuario === usuario)){
    showMessage("Usuário já cadastrado!");
    return;
  }

  usuarios.push({usuario, senha, nome});
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  showMessage("Usuário cadastrado com sucesso!");
  showPage("login");
}

function logout(){
  showConfirm("Deseja realmente sair do site?", ()=>{
    localStorage.removeItem("usuario");
    document.querySelector("nav").style.display = "none"; // esconde menu
    showPage("login");
  });
}

// -------------------- AGENDA --------------------
function renderAgenda() {
  const lista = document.querySelector(".lista-aulas");
  lista.innerHTML = ""; // limpa antes de renderizar

  const aulas = JSON.parse(localStorage.getItem("aulas")) || [];

  aulas.forEach((aula, index) => {
    const card = document.createElement("div");

    card.innerHTML = `
      <div class="info">
        <strong>${aula.aluno}</strong>
        <span>${aula.descricao}</span>
        <small>${aula.dia}</small>
      </div>

      <div class="horario">${aula.horaInicio} - ${aula.horaFim}</div>

      <div class="botoes">
        <button onclick="editarAula(${index})">✏️</button>
        <button class="delete" onclick="excluirAula(${index})">🗑️</button>
      </div>
    `;

    lista.appendChild(card);
  });
}

// -------------------- FILTRO DE AULAS --------------------
function filtrarEAfins() {
  const filtroDia = document.getElementById("filtroDia").value;
  const pesquisaAluno = document.getElementById("pesquisaAluno").value.toLowerCase();

  const aulas = JSON.parse(localStorage.getItem("aulas") || "[]");
  const lista = document.querySelector(".lista-aulas");
  lista.innerHTML = "";

  aulas.forEach((aula, i) => {
    const diaOk = filtroDia === "" || aula.dia === filtroDia;
    const alunoOk = aula.aluno.toLowerCase().includes(pesquisaAluno);

    if (diaOk && alunoOk) {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `<div class="info">
                         <strong>${aula.aluno}</strong>
                         <span>${aula.descricao}</span>
                       </div>
                       <div class="horario">${aula.dia} ${aula.horaInicio}-${aula.horaFim}</div>
                       <div class="botoes">
                         <button onclick="editarAula(${i})"><i class="fa-solid fa-pen"></i></button>
                         <button class="delete" onclick="excluirAula(${i})"><i class="fa-solid fa-trash"></i></button>
                       </div>`;
      lista.appendChild(div);
    }
  });
}

function limparFiltros() {
  document.getElementById("filtroDia").value = "";
  document.getElementById("pesquisaAluno").value = "";
  renderAgenda();
}

function excluirAula(i){
  showConfirm("Deseja realmente excluir esta aula?", ()=>{
    let aulas = JSON.parse(localStorage.getItem("aulas") || "[]");
    aulas.splice(i,1);
    localStorage.setItem("aulas", JSON.stringify(aulas));
    renderAgenda();
  });
}

// -------------------- ALUNOS --------------------
function renderAlunos(){
  const lista = document.querySelector(".lista-alunos");
  lista.innerHTML = "";
  const alunos = JSON.parse(localStorage.getItem("alunos") || "[]");

  alunos.forEach((aluno, i) => {
    const div = document.createElement("div");
    div.className = "card-aluno";
    div.innerHTML = `
      <div class="info-aluno">
        <strong>${aluno.nome}</strong> - ${aluno.email || ""} - ${aluno.telefone || ""} 
        ${aluno.obs ? `<div class="obs-aluno">Observação: ${aluno.obs}</div>` : ""}
      </div>
      <div class="acoes-card">
        <button onclick="editarAluno(${i})">Editar</button>
        <button class="delAluno" onclick="excluirAluno(${i})">Excluir</button>
      </div>`;
    lista.appendChild(div);
  });
}

document.getElementById("btnAddAluno").addEventListener("click", ()=>{
  document.getElementById("formAluno").reset();
  document.getElementById("tituloModalAluno").textContent = "Adicionar Aluno";
  document.getElementById("btnSalvarAluno").onclick = salvarAluno;
  abrirModal("modalAluno");
});

function salvarAluno(){
  const nome = document.getElementById("editNome").value;
  const email = document.getElementById("editEmail").value;
  const telefone = document.getElementById("editTelefone").value;
  const obs = document.getElementById("editObs").value;

  if(!nome){
    showMessage("Informe o nome do aluno!");
    return;
  }

  let alunos = JSON.parse(localStorage.getItem("alunos") || "[]");
  alunos.push({nome, email, telefone, obs});
  localStorage.setItem("alunos", JSON.stringify(alunos));
  fecharModal("modalAluno");
  renderAlunos();
}

function editarAluno(i){
  let alunos = JSON.parse(localStorage.getItem("alunos") || "[]");
  const aluno = alunos[i];
  document.getElementById("editNome").value = aluno.nome;
  document.getElementById("editEmail").value = aluno.email;
  document.getElementById("editTelefone").value = aluno.telefone;
  document.getElementById("editObs").value = aluno.obs;

  document.getElementById("tituloModalAluno").textContent = "Editar Aluno";
  document.getElementById("btnSalvarAluno").onclick = function(){
    alunos[i] = {
      nome: document.getElementById("editNome").value,
      email: document.getElementById("editEmail").value,
      telefone: document.getElementById("editTelefone").value,
      obs: document.getElementById("editObs").value
    };
    localStorage.setItem("alunos", JSON.stringify(alunos));
    fecharModal("modalAluno");
    renderAlunos();
  };

  abrirModal("modalAluno");
}

function excluirAluno(i){
  showConfirm("Deseja realmente excluir este aluno?", ()=>{
    let alunos = JSON.parse(localStorage.getItem("alunos") || "[]");
    alunos.splice(i,1);
    localStorage.setItem("alunos", JSON.stringify(alunos));
    renderAlunos();
  });
}

// -------------------- TAREFAS --------------------
function renderTarefas(){
  const lista = document.getElementById("listaTarefas");
  lista.innerHTML = "";
  const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");

  tarefas.forEach((tarefa, i) => {
    let dataFormatada = tarefa.data.split("-").reverse().join("/");

    const li = document.createElement("li");
    li.innerHTML = `
      <div class="tarefa-info">
        <input type="checkbox" ${tarefa.feita ? "checked" : ""}>
        <div>
          <span class="desc" style="text-decoration:${tarefa.feita ? "line-through" : "none"}">${tarefa.texto}</span>
          <span class="data">(Até ${dataFormatada})</span>
        </div>
      </div>
      <div class="acoes-tarefa">
        <button onclick="editarTarefa(${i})"><i class="fa-solid fa-pen"></i></button>
        <button onclick="excluirTarefa(${i})"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;

    li.querySelector("input").onchange = (e) => {
      tarefas[i].feita = e.target.checked;
      localStorage.setItem("tarefas", JSON.stringify(tarefas));
      renderTarefas();
    };

    lista.appendChild(li);
  });
}

function excluirTarefa(i){
  showConfirm("Deseja realmente excluir esta tarefa?", () => {
    let tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
    tarefas.splice(i,1);
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    renderTarefas();
  });
}

function editarTarefa(i){
  const tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
  const tarefa = tarefas[i];

  document.getElementById("tituloModalTarefa").textContent = "Editar Tarefa";
  document.getElementById("editDescTarefa").value = tarefa.texto;
  document.getElementById("editDataTarefa").value = tarefa.data;
  abrirModal("modalTarefa");

  document.getElementById("btnSalvarTarefa").onclick = function(){
    tarefas[i] = {
      texto: document.getElementById("editDescTarefa").value,
      data: document.getElementById("editDataTarefa").value,
      feita: tarefa.feita
    };
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
    fecharModal("modalTarefa");
    renderTarefas();
  };
}

document.getElementById("tarefasForm").addEventListener("submit", function(event){
  event.preventDefault();
  const texto = document.getElementById("tarefaDesc").value.trim();
  const data = document.getElementById("tarefaData").value;

  let tarefas = JSON.parse(localStorage.getItem("tarefas") || "[]");
  if(!Array.isArray(tarefas)) tarefas = [];

  tarefas.push({texto, data, feita: false});
  localStorage.setItem("tarefas", JSON.stringify(tarefas));

  this.reset();
  renderTarefas();
});

// -------------------- MODAIS --------------------
function abrirModal(id){
  document.getElementById(id).style.display = "flex";
}
function fecharModal(id){
  document.getElementById(id).style.display = "none";
}

// -------------------- ALERTA E CONFIRMAÇÃO --------------------
function showMessage(msg) {
  document.getElementById("alertMsg").textContent = msg;
  abrirModal("modalAlert");
}

function showConfirm(msg, callback) {
  document.getElementById("confirmMsg").textContent = msg;
  abrirModal("modalConfirm");
  document.getElementById("btnConfirmar").onclick = function() {
    fecharModal("modalConfirm");
    if (typeof callback === "function") callback();
  };
}

// -------------------- ADICIONAR / EDITAR AULA --------------------
document.getElementById("agendaForm").addEventListener("submit", function(event){
  event.preventDefault();

  const dia = document.getElementById("dia").value;
  const horaInicio = document.getElementById("horaInicio").value;
  const horaFim = document.getElementById("horaFim").value;
  const aluno = document.getElementById("aluno").value.trim();
  const descricao = document.getElementById("descricao").value.trim();

  if(!dia || !horaInicio || !horaFim || !aluno || !descricao){
    showMessage("Preencha todos os campos da aula!");
    return;
  }

  let aulas = JSON.parse(localStorage.getItem("aulas") || "[]");
  if(!Array.isArray(aulas)) aulas = [];

  aulas.push({dia, horaInicio, horaFim, aluno, descricao});
  localStorage.setItem("aulas", JSON.stringify(aulas));

  this.reset();
  renderAgenda();
});

function editarAula(i){
  let aulas = JSON.parse(localStorage.getItem("aulas") || "[]");
  const aula = aulas[i];

  document.getElementById("editAlunoAula").value = aula.aluno;
  document.getElementById("editDescAula").value = aula.descricao;
  document.getElementById("editHiAula").value = aula.horaInicio;
  document.getElementById("editHfAula").value = aula.horaFim;
  document.getElementById("editDiaAula").value = aula.dia;

  document.getElementById("btnSalvarAula").onclick = function(){
    aulas[i] = {
      aluno: document.getElementById("editAlunoAula").value,
      descricao: document.getElementById("editDescAula").value,
      horaInicio: document.getElementById("editHiAula").value,
      horaFim: document.getElementById("editHfAula").value,
      dia: document.getElementById("editDiaAula").value
    };
    localStorage.setItem("aulas", JSON.stringify(aulas));
    fecharModal("modalAula");
    renderAgenda();
  };

  abrirModal("modalAula");
}

// -------------------- PERFIL --------------------
document.getElementById("perfilForm").addEventListener("submit", function(event){
  event.preventDefault();

  const nome = document.getElementById("perfilNome").value.trim();
  const email = document.getElementById("perfilEmail").value.trim();
  const senha = document.getElementById("perfilSenha").value.trim();

  let usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
  if(!usuarioLogado) return;

  usuarioLogado.nome = nome;
  usuarioLogado.usuario = email;
  if(senha) usuarioLogado.senha = senha;

  localStorage.setItem("usuario", JSON.stringify(usuarioLogado));

  let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  let index = usuarios.findIndex(u => u.usuario === email);
  if(index !== -1){
    usuarios[index] = usuarioLogado;
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
  }

  showMessage("Perfil atualizado com sucesso!");
  document.getElementById("nomeUsuarioMenu").textContent = nome;
});

// -------------------- INICIALIZAÇÃO --------------------
window.onload = () => {
  const nav = document.querySelector("nav");
  const menuPerfil = document.getElementById("menuPerfil");

  const usuarioLogado = JSON.parse(localStorage.getItem("usuario"));
  if(usuarioLogado){
  nav.style.display = "flex";
  document.getElementById("nomeUsuarioMenu").textContent = usuarioLogado.nome || usuarioLogado.usuario;
  showPage("agenda");
  } else {
    nav.style.display = "none";
    showPage("login");
  }
};

// Reaplica eventos de form
document.getElementById("loginForm").addEventListener("submit", login);
document.getElementById("cadastroForm").addEventListener("submit", cadastrar);

// -------------------- CONTROLE DE ACESSO INICIAL --------------------
window.onload = function() {
  const user = JSON.parse(localStorage.getItem("usuario"));

  if (user) {
    // Se já tem usuário logado, mostra menu e agenda
    document.querySelector("nav").style.display = "flex";
    document.getElementById("nomeUsuarioMenu").textContent = user.nome || user.usuario;
    showPage("agenda");
  } else {
    // Se não tem usuário logado, esconde menu e mostra login
    document.querySelector("nav").style.display = "none";
    showPage("login");
  }
};

// Ativar login e cadastro
document.getElementById("loginForm").addEventListener("submit", login);
document.getElementById("cadastroForm").addEventListener("submit", cadastrar);


function salvarSenha() {
  const novaSenha = document.getElementById("novaSenha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (!novaSenha || !confirmarSenha) {
    showMessage("Preencha os dois campos de senha!");
    return;
  }

  if (novaSenha.length < 6) {
    showMessage("A nova senha deve ter no mínimo 6 caracteres.");
    return;
  }

  if (novaSenha !== confirmarSenha) {
    showMessage("As senhas não coincidem!");
    return;
  }

  // Pega o array de usuários
  let usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  if (!usuarios.length) {
    showMessage("Nenhum usuário cadastrado!");
    return;
  }

  // Atualiza a senha de todos os usuários
  usuarios = usuarios.map(u => ({ ...u, senha: novaSenha }));
  localStorage.setItem("usuarios", JSON.stringify(usuarios));

  showMessage("Senha atualizada para todos os usuários! Faça login.");
  fecharModal("modalRecuperar");
  showPage("login");
}
