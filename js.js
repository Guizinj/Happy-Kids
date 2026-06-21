const banco = supabase.createClient('https://thyxhystomblrimokbxi.supabase.co', 'sb_publishable_vgMlqThxJJUydyn1wDQiMA_mF4VqYp8');

        async function buscarProdutos(categoria){

            let validacao = banco.from('produtos').select('*');
            if(categoria){
                validacao = validacao.eq('categoria', categoria);
            }

            const {data, error} = await validacao;
            
            if(error){
                console.error('deu erro', error);
            } else {
                console.log('os produtos chegaram',);
                renderizar(data);
            }
        }
        
        buscarProdutos();

        function renderizar (lista){
            const container = document.getElementById('grid');
            container.innerHTML = ''

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