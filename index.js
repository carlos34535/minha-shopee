let todosProdutos = [];

const listaProdutos = document.getElementById("listaProdutos");
const campoBusca = document.getElementById("campoBusca");
const contadorProdutos = document.getElementById("contadorProdutos");
const botoesFiltro = document.querySelectorAll(".filtro");

const timerHoras = document.getElementById("timerHoras");
const timerMinutos = document.getElementById("timerMinutos");
const timerSegundos = document.getElementById("timerSegundos");

async function carregarProdutos() {
  try {
    listaProdutos.innerHTML = `
      <p style="color:white; font-size:18px;">
        Carregando produtos...
      </p>
    `;

    const resposta = await fetch("./ofertas.csv?v=" + new Date().getTime());

    if (!resposta.ok) {
      throw new Error("Não encontrei o arquivo ofertas.csv");
    }

    const texto = await resposta.text();

    todosProdutos = converterCSVParaProdutos(texto);

    mostrarProdutos(todosProdutos);

  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);

    contadorProdutos.textContent = "0 produtos";

    listaProdutos.innerHTML = `
      <p style="color:white; font-size:18px;">
        Erro ao carregar produtos. Verifique se o arquivo ofertas.csv está na pasta principal.
      </p>
    `;
  }
}

function converterCSVParaProdutos(textoCSV) {
  const linhas = textoCSV.trim().split(/\r?\n/);

  if (linhas.length <= 1) {
    return [];
  }

  const cabecalho = separarLinhaCSV(linhas[0]).map(item => {
    return item.replace("\ufeff", "").trim();
  });

  const produtos = [];

  for (let i = 1; i < linhas.length; i++) {
    const linha = linhas[i];

    if (!linha.trim()) {
      continue;
    }

    const valores = separarLinhaCSV(linha);

    const produtoOriginal = {};

    cabecalho.forEach((coluna, index) => {
      produtoOriginal[coluna] = valores[index] ? valores[index].trim() : "";
    });

    const produto = {
      id: produtoOriginal["ID do item"] || i,
      nome: produtoOriginal["Nome do item"] || "Produto sem nome",
      imagem: produtoOriginal["Imagem"] || "",
      linkProduto: produtoOriginal["Link do produto"] || "",
      linkOferta: produtoOriginal["Link da oferta"] || ""
    };

    produtos.push(produto);
  }

  return produtos;
}

function separarLinhaCSV(linha) {
  const resultado = [];
  let valorAtual = "";
  let dentroDeAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const caractere = linha[i];
    const proximoCaractere = linha[i + 1];

    if (caractere === '"' && dentroDeAspas && proximoCaractere === '"') {
      valorAtual += '"';
      i++;
    } else if (caractere === '"') {
      dentroDeAspas = !dentroDeAspas;
    } else if (caractere === "," && !dentroDeAspas) {
      resultado.push(valorAtual);
      valorAtual = "";
    } else {
      valorAtual += caractere;
    }
  }

  resultado.push(valorAtual);

  return resultado;
}

function mostrarProdutos(produtos) {
  listaProdutos.innerHTML = "";

  contadorProdutos.textContent = `${produtos.length} produtos`;

  if (produtos.length === 0) {
    listaProdutos.innerHTML = `
      <p style="color:white; font-size:18px;">
        Nenhum produto encontrado no CSV.
      </p>
    `;
    return;
  }

  produtos.forEach(produto => {
    const card = document.createElement("div");

    card.classList.add("produto-card");

    const imagemProduto = produto.imagem && produto.imagem !== ""
      ? `./produtos/${produto.imagem}`
      : "./assets/logo.png";

    const linkFinalShopee = produto.linkOferta && produto.linkOferta !== ""
      ? produto.linkOferta
      : produto.linkProduto;

    card.innerHTML = `
      <a href="./produto.html?id=${produto.id}" class="produto-imagem-area" title="Ver detalhes do produto">
        <img src="${imagemProduto}" alt="${produto.nome}">
      </a>

      <span class="selo-card">🔥 Oferta de hoje</span>

      <h3>
        <a href="./produto.html?id=${produto.id}" class="produto-titulo-link">
          ${produto.nome}
        </a>
      </h3>

      <a href="${linkFinalShopee}" target="_blank" rel="noopener noreferrer" class="btn-oferta">
        Ver oferta
      </a>
    `;

    listaProdutos.appendChild(card);
  });
}

function buscarProdutos() {
  const termo = campoBusca.value.toLowerCase().trim();

  const produtosFiltrados = todosProdutos.filter(produto => {
    return produto.nome.toLowerCase().includes(termo);
  });

  mostrarProdutos(produtosFiltrados);
}

if (campoBusca) {
  campoBusca.addEventListener("input", buscarProdutos);
}

botoesFiltro.forEach(botao => {
  botao.addEventListener("click", () => {
    botoesFiltro.forEach(item => item.classList.remove("ativo"));

    botao.classList.add("ativo");

    const filtro = botao.getAttribute("data-filtro");

    if (filtro === "todos") {
      mostrarProdutos(todosProdutos);
    }

    if (filtro === "recentes") {
      mostrarProdutos([...todosProdutos].reverse());
    }

    if (filtro === "clicados") {
      mostrarProdutos(todosProdutos);
    }
  });
});

function iniciarTimerDiario() {
  atualizarTimer();

  setInterval(atualizarTimer, 1000);
}

function atualizarTimer() {
  const agora = new Date();

  const meiaNoite = new Date();
  meiaNoite.setHours(24, 0, 0, 0);

  const diferenca = meiaNoite - agora;

  const horas = Math.floor(diferenca / (1000 * 60 * 60));
  const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
  const segundos = Math.floor((diferenca % (1000 * 60)) / 1000);

  if (timerHoras) {
    timerHoras.textContent = String(horas).padStart(2, "0");
  }

  if (timerMinutos) {
    timerMinutos.textContent = String(minutos).padStart(2, "0");
  }

  if (timerSegundos) {
    timerSegundos.textContent = String(segundos).padStart(2, "0");
  }
}

carregarProdutos();
iniciarTimerDiario();
