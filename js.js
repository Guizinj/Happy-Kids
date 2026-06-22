const banco = supabase.createClient('https://thyxhystomblrimokbxi.supabase.co', 'sb_publishable_vgMlqThxJJUydyn1wDQiMA_mF4VqYp8');

        async function buscarProdutos(categoria){

            let validacao = banco.from('produtos').select('*');
            if(categoria){
                validacao = validacao.eq('categoria', categoria);
            }

            const {data, error} = await validacao;
            
            if(error){
                console.error('erro contastado', error);
            } else {
                renderizar(data);
            }
        };

        buscarProdutos();

        document.querySelector('.chips').addEventListener('click', (event) =>{
            const clique = event.target.textContent;
            if (event.target.tagName !== 'BUTTON') return;

            const botoes = document.querySelectorAll('.chip').forEach(b =>
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
                        <button class="btn-acao">${p.estoque === 0 ?"Item Indisponível" : "Adicionar ao carrinho"}</button> 
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


        /*MENU*/

        document.getElementById('bar').addEventListener('click', function (){
            const chipsMenu = document.querySelector('.chips-menu');
            const icone = this.querySelector('.material-symbols-outlined');
            chipsMenu.classList.toggle('ativo');

            if(icone.textContent.trim() === 'menu'){
                icone.textContent = 'close'
            }
            else{
                icone.textContent = 'menu'
            }
        });

        document.querySelector('.chips-menu').addEventListener('click', (e) => {
            const clique = e.target.textContent;
            if (e.target.tagName !== 'BUTTON') return;

            document.querySelectorAll('.chip-menu').forEach (botao => 
            botao.classList.remove('ativo'));
            e.target.classList.add('ativo');

            if(clique === 'Todos'){
                buscarProdutos();
            }
            else{
                buscarProdutos(clique);
            }

            document.querySelectorAll('.chips-menu').forEach (botao => 
            botao.classList.remove('ativo'));


        });
