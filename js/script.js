const grid = document.getElementById("grid");
const busca = document.getElementById("busca");
const contadorProdutos = document.getElementById("contador-produtos");
const botoesFiltro = document.querySelectorAll(".filtro");

let produtos = [];
let filtroAtual = "todos";

async function carregarCSV() {
  try {
    const resposta = await fetch("ofertas.csv");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar o arquivo ofertas.csv");
    }

    const texto = await resposta.text();
    produtos = converterCSV(texto);

    renderizarProdutos(produtos);
  } catch (erro) {
    console.error("Erro ao carregar o CSV:", erro);

    contadorProdutos.textContent = "0 produtos";

    grid.innerHTML = `
      <p class="mensagem">
        Erro ao carregar os produtos. Confira se o arquivo ofertas.csv existe.
      </p>
    `;
  }
}

function converterCSV(texto) {
  const linhas = texto.trim().split(/\r?\n/);

  if (linhas.length <= 1) {
    return [];
  }

  const cabecalho = separarLinhaCSV(linhas[0]).map(coluna => {
    return coluna.replace("\uFEFF", "").trim();
  });

  return linhas.slice(1).map((linha, index) => {
    const valores = separarLinhaCSV(linha);
    const produto = {};

    cabecalho.forEach((coluna, i) => {
      produto[coluna] = valores[i] ? valores[i].trim() : "";
    });

    produto.numeroImagem = gerarNumeroImagem(index + 1);

    return produto;
  }).filter(produto => produto["Nome do item"]);
}

function separarLinhaCSV(linha) {
  const resultado = [];
  let valorAtual = "";
  let dentroDeAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const caractere = linha[i];
    const proximo = linha[i + 1];

    if (caractere === '"' && dentroDeAspas && proximo === '"') {
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

function gerarNumeroImagem(numero) {
  return String(numero).padStart(3, "0") + ".webp";
}

function obterImagemProduto(produto) {
  const imagemCSV = produto["Imagem"] || "";

  if (imagemCSV.startsWith("http")) {
    return imagemCSV;
  }

  if (imagemCSV) {
    return `produtos/${imagemCSV}`;
  }

  return `produtos/${produto.numeroImagem}`;
}

function converterVendasParaNumero(vendas) {
  if (!vendas) return 0;

  let texto = vendas.toLowerCase().trim();

  texto = texto
    .replace("mais de", "")
    .replace(/\s/g, "")
    .replace("+", "")
    .replace(",", ".");

  if (texto.includes("milhões") || texto.includes("milhao") || texto.includes("milhão")) {
    texto = texto
      .replace("milhões", "")
      .replace("milhao", "")
      .replace("milhão", "");

    const numero = parseFloat(texto);
    return isNaN(numero) ? 0 : numero * 1000000;
  }

  if (texto.includes("mil")) {
    texto = texto.replace("mil", "");
    const numero = parseFloat(texto);
    return isNaN(numero) ? 0 : numero * 1000;
  }

  const numero = parseFloat(texto);
  return isNaN(numero) ? 0 : numero;
}

function renderizarProdutos(lista) {
  grid.innerHTML = "";

  contadorProdutos.textContent = `${lista.length} produtos`;

  if (lista.length === 0) {
    grid.innerHTML = `
      <p class="mensagem">
        Nenhum produto encontrado.
      </p>
    `;
    return;
  }

  lista.forEach(produto => {
    const id = produto["ID do item"] || "";
    const nome = produto["Nome do item"] || "";
    const preco = produto["Preço"] || "";
    const vendas = produto["Vendas"] || "";
    const loja = produto["Nome da loja"] || "";
    const comissao = produto["Comissão"] || "";
    const taxaComissao = produto["Taxa de comissão"] || "";
    const caminhoImagem = obterImagemProduto(produto);

    const card = document.createElement("div");
    card.className = "produto";

    card.innerHTML = `
      <a 
        href="produto.html?id=${encodeURIComponent(id)}" 
        target="_blank" 
        rel="noopener noreferrer"
        class="produto-link-card"
      >
        <div class="produto-img-area">
          ${taxaComissao ? `<span class="desconto">${taxaComissao}</span>` : ""}

          <img 
            src="${caminhoImagem}" 
            alt="${nome}" 
            class="produto-img"
            loading="lazy"
            onerror="this.src='assets/sem-imagem.png'"
          >
        </div>

        <div class="produto-info">
          <h3 class="produto-nome">${nome}</h3>

          <div class="preco">R$ ${preco}</div>

          <p>Vendas: ${vendas}</p>
          <p>Loja: ${loja}</p>
          <p>Comissão: ${comissao}</p>

          <span class="botao-produto">
            Ver detalhes
          </span>
        </div>
      </a>
    `;

    grid.appendChild(card);
  });
}

function filtrarProdutos() {
  const textoBusca = busca.value.toLowerCase().trim();

  let produtosFiltrados = produtos.filter(produto => {
    const nome = produto["Nome do item"] || "";
    const loja = produto["Nome da loja"] || "";

    const combinaBusca =
      nome.toLowerCase().includes(textoBusca) ||
      loja.toLowerCase().includes(textoBusca);

    if (filtroAtual === "todos") {
      return combinaBusca;
    }

    if (filtroAtual === "recentes") {
      return combinaBusca;
    }

    if (filtroAtual === "clicados") {
      return combinaBusca;
    }

    return combinaBusca;
  });

  if (filtroAtual === "clicados") {
    produtosFiltrados.sort((a, b) => {
      return converterVendasParaNumero(b["Vendas"]) - converterVendasParaNumero(a["Vendas"]);
    });
  }

  renderizarProdutos(produtosFiltrados);
}

busca.addEventListener("input", filtrarProdutos);

botoesFiltro.forEach(botao => {
  botao.addEventListener("click", () => {
    botoesFiltro.forEach(btn => btn.classList.remove("ativo"));
    botao.classList.add("ativo");

    filtroAtual = botao.dataset.filtro;
    filtrarProdutos();
  });
});

carregarCSV();
