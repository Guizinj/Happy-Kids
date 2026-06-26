
const banco = supabase.createClient('https://thyxhystomblrimokbxi.supabase.co', 'sb_publishable_vgMlqThxJJUydyn1wDQiMA_mF4VqYp8');
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let produtosOn = [];

        async function buscarProdutos(categoria){

            let validacao = banco.from('produtos').select('*');
            if(categoria){
                validacao = validacao.eq('categoria', categoria);
            }

            const {data, error} = await validacao;
            
            if(error){
                console.error('erro contastado', error);
            } else {
                produtosOn = data;
                renderizar(data);
            }
        };

        buscarProdutos();

        document.querySelector('.chips').addEventListener('click', (event) =>{
            const clique = event.target.textContent;
            if (event.target.tagName !== 'BUTTON') return;

            document.querySelectorAll('.chip').forEach(b =>
            b.classList.remove('ativo'));
            event.target.classList.add('ativo');

            if(clique === 'Todos'){
                buscarProdutos();
            }
            else{
            buscarProdutos(clique);
            }
        });

        function renderizar (lista){
            const container = document.getElementById('grid');
            container.innerHTML = ''

            if (lista.length === 0) {
            container.innerHTML = `<p>Nenhum item disponível</p>`;
            return;
            }
            lista.forEach(p => {
                const card = document.createElement('div');
                card.classList.add('card');
                    card.innerHTML = `
                        <img class="img-card" src="${p.imagem}" alt="">
                        <h4>${p.nome}</h4>
                        <span class="preco">R$ ${p.preco.toFixed(2)}</span>
                        <button class="btn-acao" data-id="${p.id}" ${p.estoque === 0 ? "disabled" : ""}>${p.estoque === 0 ?"Item Indisponível" : "Adicionar ao carrinho"}</button> 
                    `;
                container.appendChild(card);
            });
        }
       
        banco
        .channel('alteração')
        .on(
            'postgres_changes',
            {event: 'UPDATE', schema: 'public', table: 'produtos'},
            (payload) =>{
                buscarProdutos();
            }
        )
        .subscribe();


        /* --- MENU --- */
        document.getElementById('bar').addEventListener('click', function (){
            const chipsMenu = document.querySelector('.chips-menu');
            const iconeMenu = this.querySelector('.material-symbols-outlined');
            chipsMenu.classList.toggle('ativo');

            if(iconeMenu.textContent.trim() === 'menu'){
                iconeMenu.textContent = 'close'
            }
            else{
                iconeMenu.textContent = 'menu'
            }
        });

        /* --- CATEGORIAS (CHIPS MENU) --- */
        document.querySelector('.chips-menu').addEventListener('click', (e) => {
        if (e.target.tagName !== 'BUTTON') return;
        
        const clique = e.target.textContent.trim();
        const chipsMenu = document.querySelector('.chips-menu');
        const iconeMenu = document.querySelector('#bar .material-symbols-outlined');

        if (clique === 'Todos') {
            buscarProdutos();
        } else {
            buscarProdutos(clique);
        }
        chipsMenu.classList.remove('ativo'); 
        if(chipsMenu){
            iconeMenu.textContent = 'menu'
        }
        });


        document.getElementById('grid').addEventListener('click', (event) =>{
            if(event.target.tagName !== "BUTTON"){
                console.log('não é botao');
                return;
            }
            else{
                console.log('é botao')
            }
            const idProduto = Number(event.target.dataset.id);
            const produtoClicado = produtosOn.find(p => p.id === idProduto);

            if(produtoClicado){
                const verifica = carrinho.find(p => p.id === idProduto);
                if(verifica){
                    verifica.quantidade += 1
                }
                else{
                    carrinho.push({...produtoClicado, quantidade: 1});
                }
            }
            localStorage.setItem('carrinho', JSON.stringify(carrinho));
            renderizarCarrinho();
            console.log(carrinho);

            
        })




        /* --- CONTROLE DO PAINEL DO CARRINHO --- */
        const painelCarrinho = document.getElementById('painel-carrinho');
        const btnAbrirCarrinho = document.getElementById('btn-carrinho');
        const btnFecharCarrinho = document.getElementById('fechar-carrinho');

        // Abre o carrinho ao clicar no ícone do header
        btnAbrirCarrinho.addEventListener('click', () => {
        painelCarrinho.classList.add('ativo');
        renderizarCarrinho(); // Atualiza a lista sempre que abre
        });

        // Fecha o carrinho no botão X
        btnFecharCarrinho.addEventListener('click', () => {
        painelCarrinho.classList.remove('ativo');
        });

        /* --- FUNÇÃO PARA RENDERIZAR OS ITENS DO CARRINHO --- */
        function renderizarCarrinho() {
        const containerItens = document.getElementById('itens-carrinho');
        const campoTotal = document.getElementById('valor-total');

        containerItens.innerHTML = ''; // Limpa o container antigo

        if (carrinho.length === 0) {
        containerItens.innerHTML = '<p>O carrinho está vazio...</p>';
        campoTotal.textContent = 'R$ 0,00';
        return;
        }

        let totalGeral = 0;

        carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;

        const elementoItem = document.createElement('div');
        elementoItem.classList.add('item-no-carrinho');
        elementoItem.innerHTML = `
        <img src="${item.imagem}" alt="${item.nome}">
        <div style="flex: 1;">
        <h4>${item.nome}</h4>
        <small>R$ ${item.preco.toFixed(2)} x ${item.quantidade}</small>
        </div>
        <span style="font-weight: bold;">R$ ${subtotal.toFixed(2)}</span>
        `;
        containerItens.appendChild(elementoItem);
        });

        campoTotal.textContent = `R$ ${totalGeral.toFixed(2)}`;
        }
