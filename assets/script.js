const baseURL = "http://localhost:3001/paletas";

async function findAllPaletas() {
  const response = await fetch(`${baseURL}/find-paletas`);
  const paletas = await response.json();

  paletas.forEach(function (paleta) {
    document.querySelector("#paletaList").insertAdjacentHTML(
      "beforeend",
      `
    <div class="PaletaListaItem" id="PaletaListaItem_${paleta.id}">
      <div>
        <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
        <div class="PaletaListaItem__preco">R$ ${paleta.preco}</div>
        <div class="PaletaListaItem__descricao">${paleta.descricao}</div>

        <div class="PaletaListaItem__acoes Acoes">
        <button class="Acoes__editar btn" onclick="abrirModal(${paleta.id})" >Editar</button>
        <button class="Acoes__apagar btn" onclick="abrirModalDelete(${paleta.id})">Deletar</button>
        </div>
      </div>
      <img class="PaletaListaItem__foto" src="${paleta.foto}" alt="Paleta de ${paleta.sabor}"/>
    </div>
      `
    );
  });
}

async function findByIdPaletas() {
  const id = document.querySelector("#idPaleta").value;

  localStorage.setItem("message", "Digite um ID para pesquisar!");
  localStorage.setItem("type", "danger");

  closeMessageAlert();
  

  const response = await fetch(`${baseURL}/one-paleta/${id}`);

  const paleta = await response.json();

  if (paleta.message != undefined) {
    localStorage.setItem("message", paleta.message);
    localStorage.setItem("type", "danger");
    return showMessageAlert();
  }

  document.querySelector(".list-all").style.display = "block"
  document.querySelector(".paleta-list").style.display = "none";

  const paletaEscolhidaDiv = document.querySelector("#paletaEscolhida");

  paletaEscolhidaDiv.innerHTML = `
    <div class="PaletaCardItem" id="PaletaListaItem_${paleta.id}">
      <div>
        <div class="PaletaCardItem__sabor">${paleta.sabor}</div>
        <div class="PaletaCardItem__preco">R$ ${paleta.preco}</div>
        <div class="PaletaCardItem__descricao">${paleta.descricao}</div>

        <div class="PaletaListaItem__acoes Acoes">
        <button class="Acoes__editar btn" onclick="abrirModal(${paleta.id})" >Editar</button>
        <button class="Acoes__apagar btn" onclick="abrirModalDelete(${paleta.id})">Deletar</button>
        </div>
      </div>
        <img class="PaletaCardItem__foto" src="${paleta.foto}" alt="Paleta de ${paleta.sabor}"/>
    </div>`;
}

findAllPaletas();

async function abrirModal(id = null) {
  if (id != null) {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar uma Paleta";

    document.querySelector("#button-form-modal").innerText = "Atualizar Paleta";

    const response = await fetch(`${baseURL}/one-paleta/${id}`);
    const paleta = await response.json();

    document.querySelector("#sabor").value = paleta.sabor;
    document.querySelector("#preco").value = paleta.preco;
    document.querySelector("#descricao").value = paleta.descricao;
    document.querySelector("#foto").value = paleta.foto;
    document.querySelector("#id").value = paleta.id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar uma Paleta";

    document.querySelector("#button-form-modal").innerText = "Cadastrar Paleta";
  }

  document.querySelector("#overlay").style.display = "flex";
}

function fecharModal() {
  document.querySelector(".modal-overlay").style.display = "none";

  document.querySelector("#sabor").value = "";
  document.querySelector("#preco").value = 0;
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
}

async function createPaleta() {
  const id = document.querySelector("#id").value;
  const sabor = document.querySelector("#sabor").value;
  const preco = document.querySelector("#preco").value;
  const descricao = document.querySelector("#descricao").value;
  const foto = document.querySelector("#foto").value;

  const paleta = {
    id,
    sabor,
    preco,
    descricao,
    foto,
  };

  const modEdicaoAtivado = id > 0;

  const endpoint = baseURL + (modoEdicaoAtivado ? `/update-paleta/${id}` : `/create-paleta`);

  const response = await fetch(endpoint, {
    method: modEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });

  const novaPaleta = await response.json();

  const html = `
  <div class="PaletaListaItem" id="PaletaListaItem_${paleta.id}">
    <div>
      <div class="PaletaListaItem__sabor">${novaPaleta.sabor}</div>
      <div class="PaletaListaItem__preco">R$ ${novaPaleta.preco}</div>
      <div class="PaletaListaItem__descricao">${novaPaleta.descricao}</div>
      <div class="PaletaListaItem__acoes Acoes">
        <button class="Acoes__editar btn" onclick="abrirModal(${paleta.id})" >Editar</button>
        <button class="Acoes__apagar btn" onclick="abrirModalDelete(${paleta.id})">Deletar</button>
      </div>
    </div>
    <img class="PaletaListaItem__foto" src="${novaPaleta.foto}" alt="Paleta de ${novaPaleta.sabor}" />
  </div>`;

  if (modEdicaoAtivado) {
    document.querySelector(`PaletaListaItem_${id}`).outerHTML = html;
  } else {
    document.querySelector("#paletaList").insertAdjacentHTML("beforeend", html);
  }

  fecharModal();
}

function abrirModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn_delete_yes");

  btnSim.addEventListener("click", function () {
    deletePaleta(id);
  });
}

function fecharModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deletePaleta(id) {
  const response = await fetch(`${baseURL}/delete-paleta/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  const result = await response.json();
  alert(result.message);
  fecharModalDelete();

  document.location.reload(true);
}

const msgAlert = document.querySelector(".msg-alert");

function closeMessageAlert() {
  setTimeout(function () {
    msgAlert.innerText = "";
    msgAlert.classList.remove(localStorage.getItem("type"));
    localStorage.clear();
  }, 3001);
}

function showMessageAlert() {
  msgAlert.innerText = localStorage.getItem("message");
  msgAlert.classList.add(localStorage.getItem("type"));
  closeMessageAlert();
}

showMessageAlert();