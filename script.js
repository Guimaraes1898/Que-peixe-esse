function garantirPuter() { 

    return new Promise((resolve, reject) => { 

        if (window.puter) { 

            resolve(window.puter); 

            return; 

        } 

        const script = document.createElement('script'); 

        // URL Oficial corrigida com o arquivo .js explícito 

        script.src = "https://puter.com";  

        script.onload = () => resolve(window.puter); 

        script.onerror = () => reject(new Error("Não foi possível carregar a biblioteca do Puter.")); 

        document.head.appendChild(script); 

    }); 

} 

 

async function lerFoto() { 

    const inputFoto = document.querySelector('.foto'); 

    const txtEspecie = document.querySelector('.especie'); 

    const txtCuidados = document.querySelector('.cuidados'); 

 

    // 1. Verifica se o usuário realmente escolheu um arquivo 

    if (!inputFoto.files || inputFoto.files.length === 0) { 

        return; 

    } 

 

    // 2. Pega o primeiro arquivo selecionado da lista 

    const arquivoImagem = inputFoto.files[0]; 

 

    // Exibe o status de carregamento na tela 

    txtEspecie.innerHTML = "<em>Analisando imagem...</em>"; 

    txtCuidados.innerHTML = "<em>Buscando informações de cuidados...</em>"; 

 

    try { 

        // Garante o carregamento do Puter 

        const puterInstancia = await garantirPuter(); 

 

        // Prompt detalhado para forçar a separação por '---' 

        const prompt = `Analise a imagem deste peixe. Responda estritamente dividindo o texto em duas partes separadas exatamente por três hífens (---).  

        Na primeira parte, diga o Nome Científico e o Nome Popular da espécie.  

        Na segunda parte, liste detalhadamente os cuidados básicos de aquarismo (tamanho do aquário, pH da água, temperatura ideal e alimentação).  

        Não adicione nenhuma saudação ou conclusão além disso.`; 

 

        // 3. Envia o arquivo de imagem diretamente dentro da lista de mídias 

        const respostaOriginal = await puterInstancia.ai.chat(prompt, [arquivoImagem], {  

            model: 'gpt-4o-mini'  

        }); 

 

        // 4. Separa o texto retornado onde estão os três hífens 

        const partes = respostaOriginal.split('---'); 

 

        if (partes.length >= 2) { 

            // Insere a primeira metade na espécie e a segunda metade nos cuidados 

            txtEspecie.innerText = partes[0].trim(); 

            txtCuidados.innerText = partes[1].trim(); 

        } else { 

            // Caso a IA não use os hífens, exibe o texto inteiro na espécie 

            txtEspecie.innerText = respostaOriginal; 

            txtCuidados.innerText = "Não foi possível separar os cuidados automaticamente."; 

        } 

 

    } catch (erro) { 

        console.error("Erro ao identificar o peixe:", erro); 

        txtEspecie.innerText = "Erro ao identificar o peixe."; 

        txtCuidados.innerText = "Por favor, certifique-se de que está conectado à internet e tente novamente."; 

    } 

} 

 

 

 

 

// 2. Função para calcular os litros do aquário (já estava funcionando!) 

function calcularLitros() { 

    const comprimentoInput = document.querySelector('.comprimento'); 

    const alturaInput = document.querySelector('.altura'); 

    const larguraInput = document.querySelector('.largura'); 

    const resultadoElemento = document.querySelector('.litros-resultado'); 

 

    const comprimento = parseFloat(comprimentoInput.value); 

    const altura = parseFloat(alturaInput.value); 

    const largura = parseFloat(larguraInput.value); 

 

    if (isNaN(comprimento) || isNaN(altura) || isNaN(largura) || comprimento <= 0 || altura <= 0 || largura <= 0) { 

        resultadoElemento.textContent = 'Valores inválidos. Insira números positivos.'; 

        return; 

    } 

 

    const litros = (comprimento * altura * largura) / 1000; 

    resultadoElemento.textContent = litros.toFixed(2); 

    console.log(`Aquário de ${litros.toFixed(2)} Litros.`); 

} 

 

// 3. Função para buscar lojas próximas (usando ViaCEP e simulação) 

async function buscarLojas(event) { 

    event.preventDefault(); // Impede o recarregamento da página ao enviar o formulário 

 

    const enderecoInput = document.getElementById('endereco'); 

    const cep = enderecoInput.value.replace(/\D/g, ''); // Remove caracteres não numéricos 

    const listaLojas = document.getElementById('lista-lojas'); 

 

    listaLojas.innerHTML = '<li>Buscando lojas próximas...</li>'; // Feedback 

 

    if (cep.length !== 8) { 

        listaLojas.innerHTML = '<li>Por favor, digite um CEP válido com 8 dígitos.</li>'; 

        return; 

    } 

 

    console.log('Buscando lojas para o CEP:', cep); 

 

    try { 

        // 1. Consulta a API ViaCEP para obter informações da localidade 

        const responseCEP = await fetch(`https://viacep.com.br/ws/${cep}/json/`); 

        const dataCEP = await responseCEP.json(); 

 

        if (dataCEP.erro) { 

            listaLojas.innerHTML = '<li>CEP não encontrado ou inválido.</li>'; 

            return; 

        } 

 

        const cidade = dataCEP.localidade; 

        const estado = dataCEP.uf; 

 

        // 2. SIMULAÇÃO de lojas com base na cidade/estado obtidos 

         

        // para encontrar pet shops ou lojas de aquarismo reais na 'cidade'. 

        const lojasSimuladas = [ 

            { nome: `Aquarismo Central (${cidade})`, endereco: `Rua Principal, 123 - ${cidade}` }, 

            { nome: `Mundo Aquático Pet (${cidade})`, endereco: `Av. dos Peixes, 456 - ${cidade}` }, 

            { nome: `Peixes & Cia (${estado})`, endereco: `Travessa do Coral, 789 - ${cidade}` }, 

            { nome: `O Paraíso Aquático (${cidade})`, endereco: `Praça da Água, 10 - ${cidade}` } 

        ].filter(loja => loja.endereco.includes(cidade) || loja.endereco.includes(estado)); // Filtra por cidade/estado 

 

        listaLojas.innerHTML = ''; // Limpa a lista 

        if (lojasSimuladas.length > 0) { 

            lojasSimuladas.forEach(loja => { 

                const li = document.createElement('li'); 

                li.textContent = `${loja.nome} - ${loja.endereco}`; 

                listaLojas.appendChild(li); 

            }); 

            console.log(`Lojas simuladas encontradas para ${cidade}/${estado}.`); 

        } else { 

            listaLojas.innerHTML = `<li>Nenhuma loja simulada encontrada para ${cidade}/${estado}.</li>`; 

        } 

 

    } catch (error) { 

        console.error('Erro ao buscar lojas:', error); 

        listaLojas.innerHTML = '<li>Erro ao buscar lojas. Tente novamente mais tarde.</li>'; 

    } 

} 

 

// 4. Função para iniciar a assinatura premium (com o desafio implementado!) 

function iniciarAssinatura() { 

    console.log('Iniciando processo de assinatura premium...'); 

    alert('Redirecionando para a página de pagamento seguro do Mercado Pago...'); 

 

    // Desafio resolvido: 

    const botaoAssinatura = document.querySelector('.botao-assinatura'); 

    const avisoPagamento = document.querySelector('.aviso-pagamento'); 

 

    botaoAssinatura.textContent = 'Assinatura Ativa!'; 

    botaoAssinatura.disabled = true; // Desabilita o botão 

    avisoPagamento.textContent = 'Obrigado por assinar! Em breve você terá acesso a todo o conteúdo premium.'; 

    avisoPagamento.style.color = 'green'; // Opcional: muda a cor para indicar sucesso 

} 

 
