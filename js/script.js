const grid = document.getElementById("grid");
const busca = document.getElementById("busca");
const contadorProdutos = document.getElementById("contador-produtos");
const botoesFiltro = document.querySelectorAll(".filtro");

let produtos = [];
let filtroAtual = "todos";

async function carregarCSV() {
  try {
    const resposta = await fetch("ofertas.csv");
    const texto = await resposta.text();

    produtos = converterCSV(texto);

    renderizarProdutos(produtos);
  } catch (erro) {
    console.error("Erro ao carregar o CSV:", erro);

    grid.innerHTML = `
      <p style="color:#b8b8c2;">
        Erro ao carregar os produtos.
      </p>
    `;
  }
}

function converterCSV(texto) {
  const linhas = texto.trim().split(/\r?\n/);
  const cabecalho = separarLinhaCSV(linhas[0]);

  return linhas.slice(1).map(linha => {
    const valores = separarLinhaCSV(linha);
    const produto = {};

    cabecalho.forEach((coluna, index) => {
      const nomeColuna = coluna.replace("\uFEFF", "").trim();
      produto[nomeColuna] = valores[index] ? valores[index].trim() : "";
    });

    return produto;
  });
}

function separarLinhaCSV(linha) {
  const resultado = [];
  let valorAtual = "";
  let dentroDeAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const caractere = linha[i];

    if (caractere === '"') {
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

  let texto = vendas
    .toLowerCase()
    .replace("mais de", "")
    .replace("milhões+", "000000")
    .replace("milhão+", "000000")
    .replace("mil+", "000")
    .replace("+", "")
    .replace(/\s/g, "")
    .replace(",", ".");

  const numero = parseFloat(texto);

  return isNaN(numero) ? 0 : numero;
}

function renderizarProdutos(lista) {
  grid.innerHTML = "";

  contadorProdutos.textContent = `${lista.length} produtos`;

  if (lista.length === 0) {
    grid.innerHTML = `
      <p style="color:#b8b8c2;">
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

    const imagem = produto["Imagem"]
      ? `produtos/${produto["Imagem"]}`
      : "";

    const card = document.createElement("div");
    card.className = "produto";

    card.innerHTML = `
      <div class="produto-img-area">
        ${taxaComissao ? `<span class="desconto">${taxaComissao}</span>` : ""}

        ${
          imagem 
          ? `<img src="${imagem}" alt="${nome}" class="produto-img">`
          : ""
        }
      </div>

      <div class="produto-info">
        <h3 class="produto-nome">${nome}</h3>

        <p>Preço: R$ ${preco}</p>
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
  const textoBusca = busca.value.toLowerCase();

  let produtosFiltrados = produtos.filter(produto => {
    const nome = produto["Nome do item"] || "";
    const combinaBusca = nome.toLowerCase().includes(textoBusca);

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
