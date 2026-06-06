function obterImagemProduto(produto) {
  return produto["Imagem"] || produto["Imagem 1"] || "assets/sem-imagem.png";
}

function renderizarProdutos(produtos) {
  const container = document.getElementById("produtos-container");

  if (!container) {
    console.error("Container não encontrado!");
    return;
  }

  container.innerHTML = "";

  produtos.forEach((produto, index) => {
    const id = index;

    const nome = produto["Nome do item"] || "Produto sem nome";
    const caminhoImagem = obterImagemProduto(produto);
    const linkOferta = produto["Link da oferta"] || produto["Link do produto"] || "#";

    const card = document.createElement("div");
    card.classList.add("produto-card");

    card.innerHTML = `
      <a href="${linkOferta}" target="_blank" class="produto-link-card">

        <div class="produto-img-area">
          <img src="${caminhoImagem}" alt="${nome}" class="produto-img">
        </div>

        <div class="produto-info">
          <h3 class="produto-nome">${nome}</h3>
          <p class="cta-text">🔥 Ver na Shopee</p>
          <span class="botao-produto">Ver detalhes</span>
        </div>

      </a>
    `;

    container.appendChild(card);
  });
}
