let pedido = 'Olhe a foto deste peixe e responda em UMA linha, sem escrever mais nada, com 2 pedaços separados por |. Primeiro pedaço: o emoji da categoria, o nome popular da espécie e o nome cietífico dentro de <strong>, um por linha usando <br>. Segundo pedaço: Os Cuidados Básicos da espécie. Exemplo de resposta:  <strong> 🐟 Oscar tigre </strong><br> | Peixe territorialista, pH entre 6.5 e 7.5, aquário mínimo de 100 litros  <br>';

async function lerFoto() {
  const foto = document.querySelector(".foto").files[0];
  const resposta = await puter.ai.chat(pedido, foto);
  const partes = resposta.message.content.split("|");
  document.querySelector(".especie").innerHTML = partes[0];
  document.querySelector(".cuidados").innerHTML = partes[1];
}

async function calcularLitros() {
  const comprimento = parseFloat(document.querySelector(".comprimento").value);
  const altura = parseFloat(document.querySelector(".altura").value);
  const largura = parseFloat(document.querySelector(".largura").value);
  const litros = (comprimento * altura * largura) / 1000;
  const resultadoLitros = document.querySelector(".litros-resultado");
  document.querySelector(".litros-resultado").innerHTML = litros;
}
