// Scroll-telling content per sector. Each step zooms the annotated image to a point
// (x, y = position of the numbered marker, 0–1 of the image) and tells what happens to the oil there.
export const STORIES = {
  'energia-eolica': {
    image: '2026/10/eolica-nacele.png',
    ratio: 1377 / 1142,
    intro: {
      kicker: 'A 100 metros de altura',
      title: 'Dentro de um gerador eólico',
      text: 'Cada ida à nacele exige equipe especializada, janela de vento e, às vezes, guindaste. Role a página para abrir o gerador e ver onde o óleo trabalha.'
    },
    steps: [
      {
        n: 1,
        x: 0.418,
        y: 0.44,
        zoom: 2.3,
        tag: 'Óleo lubrificante',
        title: 'Caixa multiplicadora',
        text: 'O coração do gerador: engrenagens que multiplicam a rotação das pás. Partículas de desgaste e água de condensação atacam rolamentos e dentes.',
        fix: 'Purificador by-pass Série BU com elementos de 114 mm retém partículas de até 1 mícron e absorve a água.'
      },
      {
        n: 2,
        x: 0.153,
        y: 0.276,
        zoom: 2.6,
        tag: 'Óleo hidráulico',
        title: 'Sistema de pitch',
        text: 'Cilindros hidráulicos giram as pás para controlar a potência. Com óleo sujo, a resposta fica lenta e as vedações se desgastam.',
        fix: 'Óleo limpo mantém o controle das pás preciso e protege válvulas e cilindros.'
      },
      {
        n: 2,
        x: 0.877,
        y: 0.479,
        zoom: 2.5,
        tag: 'Óleo hidráulico',
        title: 'Unidade hidráulica e freio',
        text: 'A central hidráulica alimenta o freio do rotor. Verniz e partículas podem travar válvulas justamente quando o freio é necessário.',
        fix: 'Removendo verniz e partículas, as válvulas trabalham livres e o óleo dura mais.'
      },
      {
        n: 2,
        x: 0.529,
        y: 0.741,
        zoom: 2.4,
        tag: 'Óleo hidráulico',
        title: 'Sistema de yaw',
        text: 'Gira a nacele inteira para acompanhar o vento. Trabalha exposto a variações de temperatura, que geram condensação no óleo.',
        fix: 'A celulose do elemento Triple R absorve a água e deixa o óleo com menos de 100 ppm.'
      }
    ],
    outro: {
      kicker: 'Resultado',
      title: 'Menos subidas na torre, mais energia gerada',
      text: 'Óleo limpo por mais tempo nos três sistemas, com menos intervenções na nacele e menos troca de óleo lá em cima.'
    }
  }
};
