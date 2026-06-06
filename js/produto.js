const containerProduto = document.getElementById("produto-detalhe");

async function carregarProduto() {
  try {
    const parametros = new URLSearchParams(window.location.search);
    const idProduto = parametros.get("id");

    if (!idProduto) {
      mostrarErro("Produto não encontrado.");
      return;
    }

    const resposta = await fetch("ofertas.csv");

    if (!resposta.ok) {
      throw new Error("Não foi possível carregar o arquivo ofertas.csv");
    }

    const texto = await resposta.text();
    const produtos = converterCSV(texto);

    const produto = produtos.find(item => item["ID do item"] === idProduto);

    if (!produto) {
      mostrarErro("Produto não encontrado na lista de ofertas.");
      return;
    }

    renderizarProduto(produto);

  } catch (erro) {
    console.error("Erro ao carregar produto:", erro);
    mostrarErro("Erro ao carregar o produto.");
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

function renderizarProduto(produto) {
  const nome = produto["Nome do item"] || "";
  const preco = produto["Preço"] || "";
  const vendas = produto["Vendas"] || "";
  const loja = produto["Nome da loja"] || "";
  const comissao = produto["Comissão"] || "";
  const taxaComissao = produto["Taxa de comissão"] || "";
  const linkProduto = produto["Link do produto"] || "#";
  const linkOferta = produto["Link da oferta"] || linkProduto;
  const caminhoImagem = obterImagemProduto(produto);

  document.title = `${nome} - Achadinhos Ofertas`;

  containerProduto.innerHTML = `
    <section class="produto-detalhe">

      <div class="produto-detalhe-img-area">
        ${taxaComissao ? `<span class="desconto detalhe-desconto">${taxaComissao}</span>` : ""}

        <img 
          src="${caminhoImagem}" 
          alt="${nome}" 
          class="produto-detalhe-img"
          onerror="this.src='assets/sem-imagem.png'"
        >
      </div>

      <div class="produto-detalhe-info">
        <span class="badge">🔥 Oferta selecionada</span>

        <h1>${nome}</h1>

        <div class="produto-detalhe-preco">
          R$ ${preco}
        </div>

        <div class="produto-detalhe-dados">
          <p><strong>Vendas:</strong> ${vendas}</p>
          <p><strong>Loja:</strong> ${loja}</p>
          <p><strong>Comissão:</strong> ${comissao}</p>
          <p><strong>Taxa de comissão:</strong> ${taxaComissao}</p>
        </div>

        <a 
          href="${linkOferta}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="botao-produto botao-detalhe"
        >
          Ir para oferta na Shopee
        </a>

        <a 
          href="index.html" 
          class="link-voltar"
        >
          Ver outras ofertas
        </a>
      </div>

    </section>
  `;
}

function mostrarErro(mensagem) {
  containerProduto.innerHTML = `
    <p class="mensagem">
      ${mensagem}
    </p>

    <a href="index.html" class="botao-produto botao-detalhe">
      Voltar para ofertas
    </a>
  `;
}

carregarProduto();
