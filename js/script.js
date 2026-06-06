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

  return linhas.slice(1).map(linha => {
    const valores = separarLinhaCSV(linha);
    const produto = {};

    cabecalho.forEach((coluna, index) => {
      produto[coluna] = valores[index] ? valores[index].trim() : "";
    });

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
    const nome = produto["Nome do item"] || "";
    const preco = produto["Preço"] || "";
    const vendas = produto["Vendas"] || "";
    const loja = produto["Nome da loja"] || "";
    const comissao = produto["Comissão"] || "";
    const taxaComissao = produto["Taxa de comissão"] || "";
    const linkOferta = produto["Link da oferta"] || produto["Link do produto"] || "#";
    const nomeImagem = produto["Imagem"] || "";

    const caminhoImagem = nomeImagem
      ? `produtos/${nomeImagem}`
      : "";

    const card = document.createElement("div");
    card.className = "produto";

    card.innerHTML = `
      <div class="produto-img-area">
        ${taxaComissao ? `<span class="desconto">${taxaComissao}</span>` : ""}

        ${
          caminhoImagem
            ? `<img 
                src="${caminhoImagem}" 
                alt="${nome}" 
                class="produto-img"
                loading="lazy"
                onerror="this.src='assets/sem-imagem.png'"
              >`
            : `<img 
                src="assets/sem-imagem.png" 
                alt="Produto sem imagem" 
                class="produto-img"
                loading="lazy"
              >`
        }
      </div>

      <div class="produto-info">
        <h3 class="produto-nome">${nome}</h3>

        <div class="preco">R$ ${preco}</div>

        <p>Vendas: ${vendas}</p>
        <p>Loja: ${loja}</p>
        <p>Comissão: ${comissao}</p>

        <a 
          href="${linkOferta}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="botao-produto"
        >
          Ver oferta
        </a>
      </div>
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
