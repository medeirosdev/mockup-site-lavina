/* Catálogo de experimentos do Projeto LAVINA.
 * Para adicionar um novo experimento, basta incluir um objeto nesta lista. */
window.LAVINA_EXPERIMENTS = [
  {
    id: "campo-eletrico",
    title: "Campo Elétrico",
    area: "Eletromagnetismo",
    thumb: "assets/img/electric-field.png",
    url: "https://lief-ifgw.github.io/Lavina/contents/electric-field/index.html",
    summary:
      "Posicione cargas positivas e negativas e observe, em tempo real, como o campo elétrico se distribui pelo espaço.",
    concepts: ["Carga elétrica", "Lei de Coulomb", "Princípio da superposição", "Vetor campo elétrico"],
    uses: [
      "Compare o campo de uma carga isolada com o de um dipolo.",
      "Peça aos alunos que prevejam a direção do campo antes de adicionar uma nova carga.",
      "Discuta em que pontos o campo resultante se anula."
    ]
  },
  {
    id: "momento-linear",
    title: "Conservação de Momento Linear",
    area: "Sistemas de partículas",
    thumb: "assets/img/momentum.png",
    url: "https://lief-ifgw.github.io/Lavina/contents/momentum/index.html",
    summary:
      "Colida corpos com massas e velocidades diferentes e verifique que o momento linear total do sistema se conserva.",
    concepts: ["Momento linear", "Colisões elásticas e inelásticas", "Sistemas isolados"],
    uses: [
      "Varie a razão entre as massas e observe as velocidades finais.",
      "Compare a energia cinética do sistema antes e depois de cada colisão.",
      "Proponha que os alunos calculem as velocidades finais e confiram na simulação."
    ]
  },
  {
    id: "lancamento-2d",
    title: "Lançamento 2D",
    area: "Cinemática",
    thumb: "assets/img/collision.png",
    url: "https://lief-ifgw.github.io/Lavina/contents/collision/index.html",
    summary:
      "Explore o movimento de projéteis no plano e veja como ângulo e velocidade inicial determinam a trajetória.",
    concepts: ["Lançamento oblíquo", "Decomposição vetorial", "Alcance e altura máxima"],
    uses: [
      "Encontre o ângulo que maximiza o alcance.",
      "Mostre que ângulos complementares produzem o mesmo alcance.",
      "Analise separadamente os movimentos horizontal e vertical."
    ]
  },
  {
    id: "graficos-cinematica",
    title: "Gráficos de Cinemática",
    area: "Cinemática",
    thumb: "assets/img/motion-charts.png",
    url: "https://lief-ifgw.github.io/Lavina/contents/motion-charts/",
    summary:
      "Relacione o movimento de um corpo com seus gráficos de posição, velocidade e aceleração em função do tempo.",
    concepts: ["MRU e MRUV", "Gráficos s×t, v×t e a×t", "Inclinação e área sob a curva"],
    uses: [
      "Peça que os alunos esbocem os gráficos antes de rodar a simulação.",
      "Interprete fisicamente a inclinação de cada gráfico.",
      "Relacione a área sob o gráfico v×t ao deslocamento."
    ]
  },
  {
    id: "plano-inclinado",
    title: "Plano Inclinado",
    area: "Dinâmica",
    thumb: "assets/img/slope.png",
    url: "https://lief-ifgw.github.io/Lavina/contents/slope/index.html",
    summary:
      "Ajuste o ângulo da rampa e entenda como o peso se decompõe e determina a aceleração do corpo.",
    concepts: ["Decomposição do peso", "Força normal", "Aceleração no plano inclinado"],
    uses: [
      "Investigue como a aceleração varia com o ângulo.",
      "Desenhe o diagrama de corpo livre em diferentes inclinações.",
      "Discuta os casos-limite de 0° e 90°."
    ]
  },
  {
    id: "leis-de-newton-atrito",
    title: "Leis de Newton e Forças de Atrito",
    area: "Dinâmica",
    thumb: "assets/img/two-blocks.png",
    url: "https://lief-ifgw.github.io/Lavina/contents/two-blocks/index.html",
    summary:
      "Analise um sistema de blocos sob a ação de forças e de atrito, aplicando as três Leis de Newton.",
    concepts: ["Leis de Newton", "Atrito estático e cinético", "Diagrama de corpo livre"],
    uses: [
      "Identifique o limiar entre atrito estático e cinético.",
      "Compare a aceleração do sistema com e sem atrito.",
      "Isole cada bloco e escreva suas equações de movimento."
    ]
  },
  {
    id: "centro-de-massa",
    title: "Entendendo o Centro de Massa",
    area: "Sistemas de partículas",
    thumb: "assets/img/center-mass.gif",
    url: "https://lief-ifgw.github.io/Lavina/contents/center-mass/index.html",
    summary:
      "Visualize o centro de massa de um sistema de partículas e acompanhe como ele se move enquanto as partes interagem.",
    concepts: ["Centro de massa", "Sistemas de partículas", "Média ponderada"],
    uses: [
      "Altere as massas e observe o deslocamento do centro de massa.",
      "Mostre que, sem forças externas, o centro de massa mantém seu estado de movimento.",
      "Calcule a posição do centro de massa à mão e compare com a simulação."
    ]
  }
];

window.LAVINA_AREAS = {
  "Cinemática": "c-cyan",
  "Dinâmica": "c-violet",
  "Sistemas de partículas": "c-amber",
  "Eletromagnetismo": "c-rose"
};
