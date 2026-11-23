// Scroll-telling content per sector. A story has scenes (annotated pictures from the old site) and
// steps. A step either shows a whole scene (overview) or zooms to one numbered marker
// (x, y = marker position, 0–1 of the picture) and tells what happens to the oil there.
const hyd = 'Óleo hidráulico';
const lub = 'Óleo lubrificante';
const mot = 'Óleo de motor';
const die = 'Diesel';

export const STORIES = {
  'energia-eolica': {
    intro: { kicker: 'A 100 metros de altura', title: 'Dentro de um gerador eólico', text: 'Cada ida à nacele exige equipe especializada, janela de vento e, às vezes, guindaste. Role a página para abrir o gerador e ver onde o óleo trabalha.' },
    scenes: [{ image: '2026/10/eolica-nacele.png', ratio: 1377 / 1142, label: 'Nacele do gerador eólico', points: [[0.418, 0.44], [0.153, 0.276], [0.877, 0.479], [0.529, 0.741]] }],
    steps: [
      { scene: 0, n: 1, x: 0.418, y: 0.44, zoom: 2.3, tag: lub, title: 'Caixa multiplicadora', text: 'Engrenagens que multiplicam a rotação das pás. Partículas de desgaste e água de condensação atacam rolamentos e dentes.', fix: 'Purificador by-pass Série BU com elementos de 114 mm retém partículas de até 1 mícron e absorve a água.' },
      { scene: 0, n: 2, x: 0.153, y: 0.276, zoom: 2.6, tag: hyd, title: 'Sistema de pitch', text: 'Cilindros hidráulicos giram as pás para controlar a potência. Com óleo sujo, a resposta fica lenta e as vedações se desgastam.', fix: 'Óleo limpo mantém o controle das pás preciso e protege válvulas e cilindros.' },
      { scene: 0, n: 2, x: 0.877, y: 0.479, zoom: 2.5, tag: hyd, title: 'Unidade hidráulica e freio', text: 'A central hidráulica alimenta o freio do rotor. Verniz e partículas podem travar válvulas justamente quando o freio é necessário.', fix: 'Removendo verniz e partículas, as válvulas trabalham livres e o óleo dura mais.' },
      { scene: 0, n: 2, x: 0.529, y: 0.741, zoom: 2.4, tag: hyd, title: 'Sistema de yaw', text: 'Gira a nacele inteira para acompanhar o vento e trabalha com variações de temperatura que geram condensação no óleo.', fix: 'A celulose do elemento Triple R absorve a água e deixa o óleo com menos de 100 ppm.' }
    ],
    outro: { kicker: 'Resultado', title: 'Menos subidas na torre, mais energia gerada', text: 'Óleo limpo por mais tempo nos três sistemas, com menos intervenções na nacele e menos troca de óleo lá em cima.' }
  },

  'setor-sucroenergetico': {
    intro: { kicker: 'Do campo à usina', title: 'Um dia de safra', text: 'Da colheita à geração de energia, a cana passa por máquinas que não podem parar. Role para acompanhar o caminho e ver onde o óleo trabalha.' },
    scenes: [
      { image: '2026/10/sucro-colhedora.webp', ratio: 1536 / 1024, label: 'Colhedora de cana', points: [[0.38, 0.539], [0.546, 0.347], [0.637, 0.539]] },
      { image: '2026/10/sucro-motobomba.webp', ratio: 1536 / 1024, label: 'Motobomba a diesel', points: [[0.462, 0.361], [0.504, 0.562]] },
      { image: '2026/10/sucro-caminhao.webp', ratio: 1536 / 1024, label: 'Caminhão canavieiro', points: [[0.264, 0.551], [0.65, 0.693]] },
      { image: '2026/10/sucro-moenda.webp', ratio: 1733 / 907, label: 'Moenda', points: [[0.254, 0.15], [0.352, 0.272], [0.478, 0.441], [0.642, 0.7], [0.138, 0.128], [0.204, 0.253], [0.286, 0.409], [0.41, 0.66]] },
      { image: '2026/10/sucro-turbogerador.webp', ratio: 1672 / 941, label: 'Turbogerador', points: [[0.481, 0.555]] }
    ],
    steps: [
      { scene: 0, overview: true, title: 'No campo: a colhedora', text: 'Trabalha dia e noite na poeira e na palha. Três sistemas dependem de óleo e combustível limpos.' },
      { scene: 0, n: 1, x: 0.38, y: 0.539, zoom: 2.4, tag: hyd, title: 'Sistema hidráulico', text: 'Acionamento dos cortadores, esteiras e elevador. Poeira e água entram no óleo e desgastam bombas e válvulas.', fix: 'Purificador by-pass Série BU direto na linha de pressão, sem bomba extra.' },
      { scene: 0, n: 2, x: 0.546, y: 0.347, zoom: 2.4, tag: mot, title: 'Motor', text: 'Fuligem e partículas saturam o óleo antes do fim do intervalo de troca.', fix: 'Purificador Série TR em by-pass no motor estende a vida do óleo.' },
      { scene: 0, n: 3, x: 0.637, y: 0.539, zoom: 2.4, tag: die, title: 'Tanque de combustível', text: 'Água e sujeira no diesel comprometem o sistema de injeção.', fix: 'Purificadores Triple R também limpam diesel, removendo água e partículas.' },
      { scene: 1, n: 1, x: 0.462, y: 0.361, zoom: 2.2, tag: mot, title: 'Motobombas de irrigação', text: 'Motores a diesel rodando horas seguidas longe da oficina. Cada troca de óleo é uma viagem a campo.', fix: 'Com o óleo purificado, os intervalos entre trocas ficam bem maiores.' },
      { scene: 2, n: 1, x: 0.264, y: 0.551, zoom: 2.2, tag: mot, title: 'Frota de caminhões', text: 'O transporte da cana não para na safra. Motor e combustível precisam aguentar o ritmo.', fix: 'Série TR no motor e purificação do diesel: mais tempo na estrada, menos na oficina.' },
      { scene: 3, overview: true, title: 'Na usina: a moenda', text: 'Turbinas a vapor e redutores movem os ternos da moenda. Caldo, água e bagaço são a ameaça.' },
      { scene: 3, n: 1, x: 0.478, y: 0.441, zoom: 2.4, tag: lub, title: 'Turbinas a vapor', text: 'O vapor condensa e contamina o óleo de lubrificação com água.', fix: 'O desidratador a vácuo TRVS remove a água livre e até 80% da dissolvida.' },
      { scene: 3, n: 2, x: 0.41, y: 0.66, zoom: 2.4, tag: lub, title: 'Redutores', text: 'Redutores planetários sob carga pesada geram partículas de desgaste o tempo todo.', fix: 'Purificadores off-line Série OSCA para os grandes volumes de óleo dos redutores.' },
      { scene: 4, n: 1, x: 0.481, y: 0.555, zoom: 2.2, tag: lub, title: 'Turbogerador', text: 'A energia da usina depende do mancal do turbogerador. Água e verniz no óleo são os maiores riscos.', fix: 'Óleo seco e limpo protege mancais e evita paradas na geração.' }
    ],
    outro: { kicker: 'Resultado', title: 'Moenda girando a safra inteira', text: 'Óleo seco e limpo do campo à usina, com menos quebra de redutor e menos paradas na safra.' }
  },

  maritimo: {
    intro: { kicker: 'A bordo', title: 'Óleo limpo em alto-mar', text: 'No mar não existe oficina por perto. Role para entrar em três tipos de embarcação e ver onde o óleo trabalha.' },
    scenes: [
      { image: '2026/10/embarcacao-1.png', ratio: 1536 / 1024, label: 'Embarcação de trabalho', points: [[0.358, 0.638], [0.261, 0.642], [0.227, 0.83], [0.268, 0.432], [0.42, 0.448], [0.7, 0.582], [0.601, 0.745], [0.731, 0.715]] },
      { image: '2026/10/embarcacao-2.png', ratio: 1536 / 768, label: 'Navegação interior', points: [[0.774, 0.513], [0.204, 0.642], [0.429, 0.66], [0.413, 0.393], [0.909, 0.464], [0.611, 0.58], [0.324, 0.698], [0.15, 0.451]] },
      { image: '2026/10/embarcacao-3.png', ratio: 1536 / 1024, label: 'Navio de longo curso', points: [[0.27, 0.568], [0.183, 0.597], [0.121, 0.662], [0.92, 0.435], [0.521, 0.498], [0.667, 0.557], [0.657, 0.698], [0.493, 0.783], [0.808, 0.583]] }
    ],
    steps: [
      { scene: 0, overview: true, title: 'Rebocadores e embarcações de apoio', text: 'Muitos sistemas hidráulicos e mecânicos num espaço pequeno, com manobras intensas o dia todo.' },
      { scene: 0, n: 1, x: 0.358, y: 0.638, zoom: 2.4, tag: mot, title: 'Motor principal', text: 'Horas de operação contínua e fuligem saturam o óleo do motor.', fix: 'Purificação by-pass Série TR estende a vida do óleo a bordo.' },
      { scene: 0, n: 5, x: 0.42, y: 0.448, zoom: 2.4, tag: hyd, title: 'Guindaste e guinchos de convés', text: 'Expostos ao ar salino: umidade e condensação entram no óleo hidráulico.', fix: 'Elementos Triple R absorvem a água e retêm partículas no mesmo passo.' },
      { scene: 0, n: 8, x: 0.731, y: 0.715, zoom: 2.4, tag: die, title: 'Tanques de combustível', text: 'Água e sujeira no diesel ameaçam a injeção dos motores.', fix: 'Remoção de água e partículas do diesel antes de chegar ao motor.' },
      { scene: 1, overview: true, title: 'Embarcações fluviais', text: 'Longas horas de motor combinadas com direção e convés hidráulicos.' },
      { scene: 1, n: 3, x: 0.429, y: 0.66, zoom: 2.4, tag: hyd, title: 'Direção hidráulica', text: 'O leme depende de um hidráulico confiável. Partículas travam válvulas no pior momento.', fix: 'Purificador Série SE no reservatório mantém o óleo limpo continuamente.' },
      { scene: 2, overview: true, title: 'Navios de longo curso', text: 'Vários sistemas de lubrificação independentes, grandes volumes e operação contínua.' },
      { scene: 2, n: 6, x: 0.667, y: 0.557, zoom: 2.4, tag: lub, title: 'Tanques de óleo', text: 'Grandes volumes acumulam partículas finas, produtos de oxidação e água ao longo da viagem.', fix: 'Série OSCA e carcaças SS para alta vazão, com certificação ATEX/EX sob demanda.' }
    ],
    outro: { kicker: 'Resultado', title: 'Menos troca de óleo a bordo', text: 'Equipamentos protegidos contra corrosão e desgaste, com óleo limpo por mais tempo em alto-mar.' }
  },

  transporte: {
    intro: { kicker: 'Na estrada', title: 'Frota rodando, não parada na oficina', text: 'Role para abrir o caminhão e ver os dois pontos onde a purificação faz diferença.' },
    scenes: [{ image: '2026/10/sucro-caminhao.webp', ratio: 1536 / 1024, label: 'Caminhão', points: [[0.264, 0.551], [0.65, 0.693]] }],
    steps: [
      { scene: 0, n: 1, x: 0.264, y: 0.551, zoom: 2.3, tag: mot, title: 'Motor', text: 'Fuligem e partículas saturam o óleo antes do fim do intervalo de troca.', fix: 'Purificador Série TR em by-pass: em muitos casos o óleo só é drenado após 4 trocas de elemento.' },
      { scene: 0, n: 2, x: 0.65, y: 0.693, zoom: 2.3, tag: die, title: 'Tanque de combustível', text: 'Água e sujeira no diesel desgastam bicos e bombas injetoras.', fix: 'Purificação do diesel no tanque ou no reservatório de abastecimento da frota.' }
    ],
    outro: { kicker: 'Resultado', title: 'Intervalos de troca maiores', text: 'Menos desgaste do motor, menos óleo comprado e descartado, e a instalação é simples.' }
  },

  'injetoras-de-plastico': {
    intro: { kicker: 'Na fábrica', title: 'Por dentro de uma injetora', text: 'Role para abrir a máquina e ver onde fica o óleo que decide a estabilidade do ciclo.' },
    scenes: [{ image: '2026/11/8.webp', ratio: 1774 / 887, label: 'Injetora de plástico', points: [[0.715, 0.729]] }],
    steps: [
      { scene: 0, overview: true, title: 'A injetora', text: 'Fechamento do molde, injeção e extração: tudo hidráulico, com servoválvulas de folgas mínimas.' },
      { scene: 0, n: 1, x: 0.715, y: 0.729, zoom: 2.4, tag: hyd, title: 'Unidade hidráulica', text: 'O óleo trabalha quente o dia todo, oxida e forma verniz, que trava servoválvulas e derruba a repetibilidade.', fix: 'Série BU direto na linha de pressão ou Série SE no reservatório, com elementos da série M.' }
    ],
    outro: { kicker: 'Resultado', title: 'Válvulas limpas, ciclo estável', text: 'Óleo trocado com muito menos frequência. A Triple R está em mais de 100.000 injetoras no mundo.' }
  },

  'extrusao-de-aluminio': {
    intro: { kicker: 'Na fábrica', title: 'Por dentro de uma prensa de extrusão', text: 'Role para abrir a prensa e ver onde ficam os milhares de litros de óleo.' },
    scenes: [{ image: '2026/11/9.webp', ratio: 1774 / 887, label: 'Prensa extrusora de alumínio', points: [[0.508, 0.316]] }],
    steps: [
      { scene: 0, overview: true, title: 'A prensa', text: 'Força enorme, alta temperatura e um sistema hidráulico com milhares de litros de óleo.' },
      { scene: 0, n: 1, x: 0.508, y: 0.316, zoom: 2.4, tag: hyd, title: 'Tanque hidráulico', text: 'Verniz e partículas se acumulam no grande volume de óleo, travam válvulas e desgastam bombas.', fix: 'Série OSCA off-line para tanques grandes, com elementos que removem verniz.' }
    ],
    outro: { kicker: 'Resultado', title: 'Menos travamentos, economia grande', text: 'Pelo volume do sistema, cada troca de óleo evitada representa uma economia grande.' }
  }
};
