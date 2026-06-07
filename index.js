let todosProdutos = [];
let produtosFiltradosAtuais = [];

let quantidadeVisivel = 12;
const quantidadePorClique = 12;

let categoriaAtual = "todos";

const listaProdutos = document.getElementById("listaProdutos");
const campoBusca = document.getElementById("campoBusca");
const contadorProdutos = document.getElementById("contadorProdutos");
const botoesFiltro = document.querySelectorAll(".filtro");
const categoriasArea = document.getElementById("categoriasArea");
const btnVerMais = document.getElementById("btnVerMais");

const timerHoras = document.getElementById("timerHoras");
const timerMinutos = document.getElementById("timerMinutos");
const timerSegundos = document.getElementById("timerSegundos");

/* =========================
   CARREGAR PRODUTOS
========================= */

async function carregarProdutos() {
  try {
    listaProdutos.innerHTML = `
      <p style="color:white; font-size:18px;">
        Carregando produtos...
      </p>
    `;

    const resposta = await fetch("./ofertas.csv?v=" + Date.now());

    if (!resposta.ok) {
      throw new Error("Não encontrei o arquivo ofertas.csv");
    }

    const texto = await resposta.text();

    todosProdutos = converterCSVParaProdutos(texto);

    produtosFiltradosAtuais = [...todosProdutos];

    criarCategorias(todosProdutos);

    quantidadeVisivel = 12;

    mostrarProdutos(produtosFiltradosAtuais);

  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);

    contadorProdutos.textContent = "0 produtos";

    listaProdutos.innerHTML = `
      <p style="color:white; font-size:18px;">
        Erro ao carregar produtos. Confira o arquivo ofertas.csv.
      </p>
    `;
  }
}

/* =========================
   CONVERTER CSV SIMPLES
   Formato:
   id,nome,link,imagem,categoria
========================= */

function converterCSVParaProdutos(textoCSV) {
  const linhas = textoCSV.trim().split(/\r?\n/);

  if (linhas.length <= 1) {
    return [];
  }

  const produtos = [];

  for (let i = 1; i < linhas.length; i++) {
    const linha = linhas[i];

    if (!linha.trim()) {
      continue;
    }

    const valores = separarLinhaCSV(linha);

    const produto = {
      id: valores[0] ? valores[0].trim() : `produto${i}`,
      nome: valores[1] ? valores[1].trim() : "Produto sem nome",
      link: valores[2] ? valores[2].trim() : "#",
      imagem: valores[3] ? valores[3].trim() : "",
      categoria: valores[4] ? valores[4].trim() : "Outros"
    };

    produtos.push(produto);
  }

  return produtos;
}

/* =========================
   SEPARAR LINHA CSV
========================= */

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

/* =========================
   CATEGORIAS
========================= */

function criarCategorias(produtos) {
  if (!categoriasArea) {
    return;
  }

  const categorias = produtos
    .map(produto => produto.categoria || "Outros")
    .filter(categoria => categoria.trim() !== "");

  const categoriasUnicas = ["todos", ...new Set(categorias)];

  categoriasArea.innerHTML = "";

  categoriasUnicas.forEach(categoria => {
    const botao = document.createElement("button");

    botao.classList.add("categoria-btn");

    if (categoria === "todos") {
      botao.classList.add("ativo");
      botao.textContent = "Todas categorias";
    } else {
      botao.textContent = categoria;
    }

    botao.setAttribute("data-categoria", categoria);

    botao.addEventListener("click", () => {
      document.querySelectorAll(".categoria-btn").forEach(item => {
        item.classList.remove("ativo");
      });

      botao.classList.add("ativo");

      categoriaAtual = categoria;

      quantidadeVisivel = 12;

      aplicarFiltros();
    });

    categoriasArea.appendChild(botao);
  });
}

/* =========================
   MOSTRAR PRODUTOS
========================= */

function mostrarProdutos(produtos) {
  listaProdutos.innerHTML = "";

  contadorProdutos.textContent = `${produtos.length} produtos`;

  if (produtos.length === 0) {
    listaProdutos.innerHTML = `
      <p style="color:white; font-size:18px;">
        Nenhum produto encontrado.
      </p>
    `;

    atualizarBotaoVerMais(produtos);
    return;
  }

  const produtosParaMostrar = produtos.slice(0, quantidadeVisivel);

  produtosParaMostrar.forEach(produto => {
    const card = document.createElement("div");

    card.classList.add("produto-card");

    const imagemProduto = produto.imagem && produto.imagem !== ""
      ? `./produtos/${produto.imagem}`
      : "./assets/logo.png";

    card.innerHTML = `
      <a href="./produto.html?id=${produto.id}" class="produto-imagem-area" title="Ver detalhes do produto">
        <img 
          src="${imagemProduto}" 
          alt="${produto.nome}" 
          onerror="this.onerror=null; this.src='./assets/logo.png';"
        >
      </a>

      <span class="selo-card">🔥 Oferta de hoje</span>

      <h3>
        <a href="./produto.html?id=${produto.id}" class="produto-titulo-link">
          ${produto.nome}
        </a>
      </h3>

      <a href="${produto.link}" target="_blank" rel="noopener noreferrer" class="btn-oferta">
        Ver oferta
      </a>
    `;

    listaProdutos.appendChild(card);
  });

  atualizarBotaoVerMais(produtos);
}

/* =========================
   BOTÃO VER MAIS
========================= */

function atualizarBotaoVerMais(produtos) {
  if (!btnVerMais) {
    return;
  }

  if (quantidadeVisivel >= produtos.length) {
    btnVerMais.style.display = "none";
  } else {
    btnVerMais.style.display = "inline-block";
    btnVerMais.textContent = `Ver mais produtos`;
  }
}

if (btnVerMais) {
  btnVerMais.addEventListener("click", () => {
    quantidadeVisivel += quantidadePorClique;
    mostrarProdutos(produtosFiltradosAtuais);
  });
}

/* =========================
   BUSCA E FILTROS
========================= */

function aplicarFiltros() {
  const termo = campoBusca ? campoBusca.value.toLowerCase().trim() : "";

  let resultado = [...todosProdutos];

  if (categoriaAtual !== "todos") {
    resultado = resultado.filter(produto => {
      return produto.categoria === categoriaAtual;
    });
  }

  if (termo !== "") {
    resultado = resultado.filter(produto => {
      return produto.nome.toLowerCase().includes(termo);
    });
  }

  produtosFiltradosAtuais = resultado;

  mostrarProdutos(produtosFiltradosAtuais);
}

function buscarProdutos() {
  quantidadeVisivel = 12;
  aplicarFiltros();
}

if (campoBusca) {
  campoBusca.addEventListener("input", buscarProdutos);
}

/* =========================
   FILTROS DE ORDEM
========================= */

botoesFiltro.forEach(botao => {
  botao.addEventListener("click", () => {
    botoesFiltro.forEach(item => item.classList.remove("ativo"));

    botao.classList.add("ativo");

    const filtro = botao.getAttribute("data-filtro");

    let base = [...todosProdutos];

    if (categoriaAtual !== "todos") {
      base = base.filter(produto => produto.categoria === categoriaAtual);
    }

    const termo = campoBusca ? campoBusca.value.toLowerCase().trim() : "";

    if (termo !== "") {
      base = base.filter(produto => produto.nome.toLowerCase().includes(termo));
    }

    if (filtro === "todos") {
      produtosFiltradosAtuais = base;
    }

    if (filtro === "recentes") {
      produtosFiltradosAtuais = [...base].reverse();
    }

    if (filtro === "clicados") {
      produtosFiltradosAtuais = base;
    }

    quantidadeVisivel = 12;

    mostrarProdutos(produtosFiltradosAtuais);
  });
});

/* =========================
   TIMER DIÁRIO
========================= */

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

/* =========================
   BANNER ROTATIVO LATERAL
========================= */

const imagensAnuncios = [
  "./ads/001.webp",
  "./ads/002.webp",
  "./ads/003.webp",
  "./ads/004.webp"
];

let anuncioAtual = 0;

function iniciarBannerRotativo() {
  const banner = document.getElementById("bannerShopee");

  if (!banner) {
    return;
  }

  banner.onerror = function () {
    this.onerror = null;
    this.src = "./assets/logo.png";
  };

  setInterval(() => {
    anuncioAtual++;

    if (anuncioAtual >= imagensAnuncios.length) {
      anuncioAtual = 0;
    }

    banner.src = imagensAnuncios[anuncioAtual];
  }, 4000);
}

/* =========================
   INICIAR SITE
========================= */

carregarProdutos();
iniciarTimerDiario();
iniciarBannerRotativo();
