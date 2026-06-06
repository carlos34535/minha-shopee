const grid = document.getElementById("grid");
const busca = document.getElementById("busca");
const contadorProdutos = document.getElementById("contador-produtos");
const botoesFiltro = document.querySelectorAll(".filtro");

let filtroAtual = "todos";

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
        const card = document.createElement("div");
        card.className = "produto";

        card.innerHTML = `
            <div class="produto-img-area">
                <span class="desconto">${produto.desconto}</span>
                <img src="${produto.imagem}" alt="${produto.nome}" class="produto-img">
            </div>

            <div class="produto-info">
                <h3 class="produto-nome">${produto.nome}</h3>

                <div class="preco">${produto.preco}</div>
                <div class="preco-antigo">${produto.precoAntigo}</div>

                <a 
                    href="${produto.link}" 
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
        const combinaBusca = produto.nome.toLowerCase().includes(textoBusca);

        if (filtroAtual === "todos") {
            return combinaBusca;
        }

        if (filtroAtual === "recentes") {
            return combinaBusca && produto.categoria === "recentes";
        }

        if (filtroAtual === "clicados") {
            return combinaBusca && produto.categoria === "clicados";
        }

        return combinaBusca;
    });

    if (filtroAtual === "clicados") {
        produtosFiltrados.sort((a, b) => b.cliques - a.cliques);
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

renderizarProdutos(produtos);