// ================================
// CONFIGURAÇÃO DO GRID
// ================================

const grid = document.getElementById("grid");


// ================================
// FUNÇÃO: MOSTRAR PRODUTOS
// ================================
function mostrarProdutos(lista) {

    // limpa antes de renderizar
    grid.innerHTML = "";

    lista.forEach(produto => {

        grid.innerHTML += `
            <div class="bg-white rounded-xl shadow overflow-hidden">

                <!-- IMAGEM 9:16 (ESTILO REELS) -->
                <div class="relative">
                    <img src="${produto.imagem}" 
                         class="w-full aspect-[9/16] object-cover">

                    <!-- TAG DE PROMOÇÃO -->
                    <span class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                        🔥 Oferta
                    </span>
                </div>

                <!-- CONTEÚDO -->
                <div class="p-3">

                    <!-- NOME -->
                    <h3 class="font-semibold text-sm line-clamp-2">
                        ${produto.nome}
                    </h3>

                    <!-- PREÇO -->
                    <p class="text-orange-500 font-bold text-lg mt-1">
                        ${produto.preco}
                    </p>

                    <!-- BOTÃO -->
                    <a href="${produto.link}" 
                       target="_blank"
                       class="block text-center bg-orange-500 text-white mt-3 py-2 rounded-lg font-semibold hover:bg-orange-600 transition">

                        ⚡ Ver Oferta
                    </a>

                </div>

            </div>
        `;
    });
}


// ================================
// INICIAR SITE
// ================================
mostrarProdutos(produtos);


// ================================
// BUSCA (FUNCIONANDO)
// ================================

const busca = document.getElementById("busca");

busca.addEventListener("input", function() {

    const valor = busca.value.toLowerCase();

    const filtrados = produtos.filter(produto =>
        produto.nome.toLowerCase().includes(valor)
    );

    mostrarProdutos(filtrados);
});