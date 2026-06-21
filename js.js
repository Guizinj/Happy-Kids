const banco = supabase.createClient('https://thyxhystomblrimokbxi.supabase.co', 'sb_publishable_vgMlqThxJJUydyn1wDQiMA_mF4VqYp8');

        async function buscarProdutos(){
            const {data, error} = await banco.from('produtos').select('*');
            
            if(error){
                console.error('deu erro', error);
            } else {
                console.log('os produtos chegaram',);
                renderizar(data);
            }
        }
        
        buscarProdutos();

        function renderizar (lista){
            const container = document.getElementById('container-produtos');
            container.innerHTML = ''

            lista.forEach(p => {
                const card = document.createElement('div');
                card.classList.add('card');

                if (p.estoque === 0) {
                    card.innerHTML = `
                        <h2>${p.nome}</h2>
                        <p>Preço: R$ ${p.preco.toFixed(2)}</p>
                        <span class="badge-esgotado">ESGOTADO</span>
                        <button class="btn-indisponivel" disabled>Indisponível</button>
                    `;
                }
                else if (p.estoque === 1){
                     card.innerHTML = `
                        <h2>${p.nome}</h2>
                        <h3>${p.categoria}</h3>
                        <p>Preço: R$${p.preco.toFixed(2)}</p>
                        <span class="badge-disponivel">DISPONÍVEL(${p.estoque} un)</span>
                        <p>Resta uma unidade</p>
                    `;
                }
                else {
                    card.innerHTML = `
                        <h2>${p.nome}</h2>
                        <h3>${p.categoria}</h3>
                        <p>Preço: R$${p.preco.toFixed(2)}</p>
                        <span class="badge-disponivel">DISPONÍVEL (${p.estoque} un)</span>
                        
                    `;
                }
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