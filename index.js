let todosProdutos = [];

const listaProdutos = document.getElementById("listaProdutos");
const campoBusca = document.getElementById("campoBusca");
const contadorProdutos = document.getElementById("contadorProdutos");
const botoesFiltro = document.querySelectorAll(".filtro");

async function carregarProdutos() {
  try {
    const resposta = await fetch("ofertas.csv");
    const texto = await resposta.text();

    todosProdutos = converterCSVParaProdutos(texto);

    mostrarProdutos(todosProdutos);
  } catch (erro) {
    console.error("Erro ao carregar produtos:", erro);

    listaProdutos.innerHTML = `
      <p style="color: #fff;">
        Erro ao carregar os produtos. Verifique se o arquivo ofertas.csv está na pasta principal do site.
      </p>
    `;
  }
}

function converterCSVParaProdutos(textoCSV) {
  const linhas = textoCSV.trim().split(/\r?\n/);

  const cabecalho = separarLinhaCSV(linhas[0]).map(item => item.trim());

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
      linkProduto: produtoOriginal["Link do produto"] || "",
      linkOferta: produtoOriginal["Link da oferta"] || "",
      imagem: produtoOriginal["Imagem"] || ""
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
      <p style="color: #fff;">
        Nenhum produto encontrado.
      </p>
    `;
    return;
  }

  produtos.forEach(produto => {
    const card = document.createElement("div");

    card.classList.add("produto-card");

    const imagemProduto = produto.imagem && produto.imagem !== ""
      ? `produtos/${produto.imagem}`
      : "assets/logo.png";

    card.innerHTML = `
      <a href="produto.html?id=${produto.id}" class="produto-imagem-area">
        <img src="${imagemProduto}" alt="${produto.nome}">
      </a>

      <h3>${produto.nome}</h3>

      <a href="produto.html?id=${produto.id}" class="btn-oferta">
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
      const recentes = [...todosProdutos].reverse();
      mostrarProdutos(recentes);
    }

    if (filtro === "clicados") {
      mostrarProdutos(todosProdutos);
    }
  });
});

carregarProdutos();
