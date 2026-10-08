function carregarBibliotecaPuter() {
    return new Promise((resolve, reject) => {
        if (window.puter) {
            resolve(window.puter);
            return;
        }

        const script = document.createElement('script');
        // Usando o espelho oficial e estável do UNPKG para contornar bloqueios de rede
        script.src = "https://unpkg.com";
        script.async = true;
        
        script.onload = () => {
            if (window.puter) {
                resolve(window.puter);
            } else {
                reject(new Error("Puter carregado, mas objeto não encontrado."));
            }
        };
        
        script.onerror = () => reject(new Error("Falha ao carregar o espelho alternativo do Puter."));
        document.head.appendChild(script);
    });
}

async function lerFoto() {
    const inputFoto = document.querySelector('.foto');
    const txtEspecie = document.querySelector('.especie');
    const txtCuidados = document.querySelector('.cuidados');

    if (!inputFoto.files || inputFoto.files.length === 0) {
        return;
    }

    const arquivoImagem = inputFoto.files;

    txtEspecie.innerHTML = "<em>Carregando inteligência artificial...</em>";
    txtCuidados.innerHTML = "<em>Aguarde...</em>";

    try {
        // Carrega e ativa o Puter de forma garantida
        const puterSeguro = await carregarBibliotecaPuter();

        txtEspecie.innerHTML = "<em>Analisando imagem do peixe...</em>";
        txtCuidados.innerHTML = "<em>Buscando informações de cuidados...</em>";

        const prompt = `Analise a imagem deste peixe. Responda estritamente dividindo o texto em duas partes separadas exatamente por três hífens (---). 
        Na primeira parte, diga o Nome Científico e o Nome Popular da espécie. 
        Na segunda parte, liste detalhadamente os cuidados básicos de aquarismo (tamanho do aquário, pH da água, temperatura ideal e alimentação). 
        Não adicione nenhuma saudação ou conclusão além disso.`;

        // Envia para a IA do Puter usando o modelo multimodal gpt-4o-mini
        const respostaOriginal = await puterSeguro.ai.chat(prompt, arquivoImagem, { 
            model: 'gpt-4o-mini' 
        });

        const partes = respostaOriginal.split('---');

        if (partes.length >= 2) {
            txtEspecie.innerText = partes.trim();
            txtCuidados.innerText = partes.trim();
        } else {
            txtEspecie.innerText = respostaOriginal;
            txtCuidados.innerText = "Não foi possível separar as seções automaticamente.";
        }

    } catch (erro) {
        console.error("Erro na aplicação:", erro);
        txtEspecie.innerText = "Erro ao conectar com o Puter.ai.";
        txtCuidados.innerText = "Verifique sua conexão ou tente rodar o projeto usando o Live Server do VS Code.";
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

 
