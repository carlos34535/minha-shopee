<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Minha Shopee</title>

  <style>
    body {
      font-family: Arial;
      background: #0f0f0f;
      color: white;
      text-align: center;
    }

    #produtos-container {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 20px;
    }

    .produto-card {
      background: #1a1a1a;
      border-radius: 10px;
      width: 200px;
      overflow: hidden;
    }

    .produto-img {
      width: 100%;
    }

    .produto-info {
      padding: 10px;
    }

    .botao {
      background: orange;
      padding: 8px;
      display: inline-block;
      margin-top: 10px;
      border-radius: 5px;
    }

    a {
      text-decoration: none;
      color: white;
    }
  </style>
</head>
<body>

<h1>🔥 Achadinhos da Shopee</h1>

<div id="produtos-container"></div>

<script>
const produtos = [
  {
    nome: "Kit Shampoo V-FLOC",
    imagem: "https://via.placeholder.com/300",
    link: "https://shopee.com.br"
  },
  {
    nome: "Tênis Masculino",
    imagem: "https://via.placeholder.com/300",
    link: "https://shopee.com.br"
  }
];

function renderizar() {
  const container = document.getElementById("produtos-container");

  produtos.forEach(produto => {
    const card = document.createElement("div");
    card.className = "produto-card";

    card.innerHTML = `
      <a href="${produto.link}" target="_blank">
        <img src="${produto.imagem}" class="produto-img">
        <div class="produto-info">
          <h3>${produto.nome}</h3>
          <div class="botao">🔥 Ver na Shopee</div>
        </div>
      </a>
    `;

    container.appendChild(card);
  });
}

renderizar();
</script>

</body>
</html>
