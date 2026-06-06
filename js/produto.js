function obterImagemProduto(produto) {
  return produto["Imagem"] || produto["Imagem 1"] || "assets/sem-imagem.png";
}

function carregarProduto(produtos) {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const produto = produtos[id];

  if (!produto) {
    document.getElementById("produto-container").innerHTML = "<p>Produto não encontrado.</p>";
    return;
  }

  const nome = produto["Nome do item"] || "";
  const caminhoImagem = obterImagemProduto(produto);
  const linkOferta = produto["Link da oferta"] || produto["Link do produto"] || "#";

  const containerProduto = document.getElementById("produto-container");

  containerProduto.innerHTML = `
    <section class="produto-detalhe">

      <div class="produto-detalhe-img-area">
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

        <p class="cta-text">
          Confira essa oferta direto na Shopee
        </p>

        <a 
          href="${linkOferta}" 
          target="_blank" 
          class="botao-produto botao-detalhe"
        >
          Ir para oferta na Shopee
        </a>

        <a href="index.html" class="link-voltar">
          Ver outras ofertas
        </a>
      </div>

    </section>
  `;
}
