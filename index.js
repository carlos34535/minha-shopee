<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Achadinhos - Ofertas</title>

  <link rel="stylesheet" href="css/style.css">
</head>

<body>

  <header class="topo">
    <div class="container topo-conteudo">

      <a href="index.html" class="logo-area">
        <img src="assets/logo.png" alt="Logo Achadinhos" class="logo-img">
        <span class="logo-texto">
          Achadinhos <strong>ofertas</strong>
        </span>
      </a>

      <div class="busca-area">
        <input 
          type="text" 
          id="campoBusca" 
          placeholder="Buscar produto..."
        >
      </div>

    </div>
  </header>

  <main>

    <section class="hero">
      <div class="container">

        <div class="selo">
          🔥 Ofertas selecionadas
        </div>

        <h1>
          Encontre os melhores <span>achadinhos</span>
        </h1>

        <p>
          Produtos com ofertas selecionadas para você economizar mais.
        </p>

      </div>
    </section>

    <section class="produtos-section">
      <div class="container">

        <div class="titulo-area">
          <h2>Produtos em destaque</h2>
          <span id="contadorProdutos">0 produtos</span>
        </div>

        <div class="filtros">
          <button class="filtro ativo" data-filtro="todos">Todos</button>
          <button class="filtro" data-filtro="recentes">Recentes</button>
          <button class="filtro" data-filtro="clicados">Mais clicados</button>
        </div>

        <div id="listaProdutos" class="grid-produtos">
          <!-- Os produtos serão carregados aqui pelo JavaScript -->
        </div>

      </div>
    </section>

  </main>

  <script src="js/index.js"></script>

</body>
</html>
