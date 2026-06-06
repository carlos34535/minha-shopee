const produtoDetalhe = document.getElementById("produtoDetalhe");

async function carregarProdutoDetalhe() {
  try {
    const parametros = new URLSearchParams(window.location.search);
    const idProduto = parametros.get("id");

    if (!idProduto) {
      produtoDetalhe.innerHTML = `
        <p>Produto não encontrado.</p>
      `;
      return;
    }

    const resposta = await fetch("ofertas.csv");
    const texto = await resposta.text();

    const produtos = converterCSVParaProdutos(texto);

    const produto = produtos.find(item => String(item.id) === String(idProduto));

    if (!produto) {
      produtoDetalhe.innerHTML = `
        <p>Produto não encontrado.</p>
      `;
      return;
    }

    mostrarProduto(produto);

  } catch (erro) {
    console.error("Erro ao carregar produto:", erro);

    produtoDetalhe.innerHTML = `
      <p>Erro ao carregar o produto.</p>
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

function mostrarProduto(produto) {
  const imagemProduto = produto.imagem && produto.imagem !== ""
    ? `produtos/${produto.imagem}`
    : "assets/logo.png";

  const linkFinal = produto.linkOferta && produto.linkOferta !== ""
    ? produto.linkOferta
    : produto.linkProduto;

  produtoDetalhe.innerHTML = `
    <div class="produto-detalhe-img">
      <img src="${imagemProduto}" alt="${produto.nome}">
    </div>

    <div class="produto-detalhe-info">
      <h1>${produto.nome}</h1>

      <p>
        Oferta selecionada. Clique no botão abaixo para acessar o produto.
      </p>

      <a href="${linkFinal}" target="_blank" class="btn-grande">
        Ir para oferta
      </a>
    </div>
  `;
}

carregarProdutoDetalhe();
