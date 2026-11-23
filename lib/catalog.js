// Short, scannable product-line data used by the Soluções filters, series cards and product pages.
// `apps` and `volume` drive the filters; `highlights` are the 4 icon bullets on each product page.
export const APPS = [
  { id: 'hidraulico', label: 'Óleo hidráulico' },
  { id: 'lubrificacao', label: 'Lubrificação / redutores' },
  { id: 'motor', label: 'Motor e diesel' },
  { id: 'agua', label: 'Água no óleo' },
  { id: 'ar', label: 'Ar no óleo' },
  { id: 'metalico', label: 'Partículas metálicas' },
  { id: 'reposicao', label: 'Elementos de reposição' }
];

export const VOLUMES = [
  { id: 'v1', label: 'Até 1.000 L' },
  { id: 'v2', label: '1.000 a 10.000 L' },
  { id: 'v3', label: 'Acima de 10.000 L' }
];

export const SERIES_META = {
  'elementos-filtrantes': {
    line: 'Elementos de reposição 3 em 1 para todos os purificadores Triple R.',
    volume: 'Para BU, SU, SE, SS, TR e OSCA',
    apps: ['reposicao', 'hidraulico', 'lubrificacao', 'motor'],
    vols: [],
    highlights: [
      ['filter', '114 mm de meio filtrante em profundidade, em 3 estágios'],
      ['particle', 'Retém partículas de até 1 mícron'],
      ['drop', 'Absorve água: óleo com menos de 100 ppm'],
      ['check', 'Testados Multipass, eficiência comprovada']
    ]
  },
  'serie-bu': {
    line: 'By-pass ligado direto na linha de alta pressão, sem bomba nem motor.',
    volume: 'Sistemas de 300 a 1.800 L',
    apps: ['hidraulico'],
    vols: ['v1', 'v2'],
    highlights: [
      ['particle', 'Remove partículas de até 1 mícron'],
      ['drop', 'Remove água, borra e verniz no mesmo elemento'],
      ['plug', 'Liga na linha de alta pressão: sem motor nem bomba'],
      ['gauge', 'Válvulas de fluxo e alívio e manômetro integrados']
    ]
  },
  'serie-su': {
    line: 'By-pass em aço inox 304, instalação fixa junto à máquina.',
    volume: 'Sistemas de 2.000 a 3.000 L',
    apps: ['hidraulico'],
    vols: ['v2'],
    highlights: [
      ['shield', 'Carcaça em aço inox 304, sobre pernas'],
      ['particle', 'Remove partículas de até 1 mícron, água e verniz'],
      ['gauge', 'Trabalha na linha de 0,5 a 5 bar'],
      ['tank', 'Para sistemas de 2.000 a 3.000 L']
    ]
  },
  'serie-se': {
    line: 'Off-line com motobomba própria, ligado ao reservatório.',
    volume: 'Tanques de até 3.600 L',
    apps: ['hidraulico', 'lubrificacao'],
    vols: ['v1', 'v2'],
    highlights: [
      ['pump', 'Off-line, com motobomba compacta própria'],
      ['particle', 'Elemento absoluto de 2 µm (série M)'],
      ['gauge', 'Filtro de sucção, chave com proteção térmica e manômetro'],
      ['drop', 'Versão para água-glicol (elemento WG)']
    ]
  },
  'serie-ss': {
    line: 'Carcaças de 2 a 6 elementos para alta vazão.',
    volume: 'Vazão de até 60 L/min',
    apps: ['hidraulico', 'lubrificacao'],
    vols: ['v2', 'v3'],
    highlights: [
      ['flow', 'Vazão de até 60 L/min (3.600 L/h)'],
      ['filter', 'Carcaças com 2, 3, 4, 5 ou 6 elementos'],
      ['shield', 'Aço carbono, suporta até 15 bar'],
      ['ship', 'Muito usada em aplicações marítimas']
    ]
  },
  'serie-osca': {
    line: 'Off-line de alto fluxo para reservatórios grandes.',
    volume: 'Tanques de 200 a 100.000 L',
    apps: ['hidraulico', 'lubrificacao', 'motor'],
    vols: ['v1', 'v2', 'v3'],
    highlights: [
      ['tank', 'Para tanques de 200 a 100.000 L'],
      ['particle', 'Limpeza até NAS 5 ou melhor'],
      ['flow', 'Óleos de 1 a 600 cSt, diesel e ésteres'],
      ['check', 'Pode estender a vida do óleo até 40.000 h']
    ]
  },
  'osca-os': {
    line: 'Separa o óleo de fluidos à base de água, como água-glicol.',
    volume: 'Consulte',
    apps: ['agua'],
    vols: [],
    highlights: [
      ['drop', 'Separa óleo de fluidos à base de água'],
      ['truck', 'Versão móvel ou fixa'],
      ['gear', 'Fácil operação e manutenção'],
      ['check', 'Aumenta a vida útil do fluido']
    ]
  },
  'serie-tr': {
    line: 'By-pass compacto para óleo de motor, diesel e engrenagens.',
    volume: 'Consulte',
    apps: ['motor', 'lubrificacao', 'hidraulico'],
    vols: ['v1'],
    highlights: [
      ['engine', 'Feito para óleo de motor em circuito by-pass'],
      ['particle', 'Remove partículas finas, água e resíduos de oxidação'],
      ['drop', 'Indicado para motores com biocombustível'],
      ['gear', 'Também para redutores e sistemas abaixo de 6 bar']
    ]
  },
  'serie-trcs': {
    line: 'Centrífuga + carcaça SS: sujeira grossa, borra e partículas finas.',
    volume: 'Consulte',
    apps: ['hidraulico', 'lubrificacao', 'motor'],
    vols: [],
    highlights: [
      ['gear', 'Centrífuga remove sujeira grossa e borra'],
      ['particle', 'Carcaça SS retém partículas microscópicas'],
      ['check', 'Intervalos maiores entre trocas de elemento'],
      ['drop', 'Para óleo hidráulico, lubrificante e diesel']
    ]
  },
  'serie-bf': {
    line: 'Purificador by-pass para compressores de refrigeração.',
    volume: 'Até 1 L/min',
    apps: ['lubrificacao'],
    vols: [],
    highlights: [
      ['snow', 'Para compressores de refrigeração com amônia'],
      ['particle', 'Remove partículas metálicas, água e verniz'],
      ['shield', 'Aço carbono, opera até 20 bar'],
      ['flow', 'Óleos de 2 a 680 cSt']
    ]
  },
  'desidratador-a-vacuo-termovacuo': {
    line: 'Desidratador a vácuo: tira a água livre e a dissolvida.',
    volume: 'Consulte',
    apps: ['agua', 'ar', 'lubrificacao', 'hidraulico'],
    vols: ['v1', 'v2', 'v3'],
    highlights: [
      ['drop', 'Remove 100% da água livre e 80% da dissolvida'],
      ['air', 'Remove 100% das bolhas de ar'],
      ['gear', 'Operação totalmente automática'],
      ['flow', 'Óleos de 10 a 680 cSt']
    ]
  },
  'serie-ws': {
    line: 'Separador de água por coalescência, com filtragem do óleo.',
    volume: 'Consulte',
    apps: ['agua', 'hidraulico', 'lubrificacao'],
    vols: [],
    highlights: [
      ['drop', 'Separa a água por coalescência e drena fácil'],
      ['filter', 'Separa água e filtra o óleo ao mesmo tempo'],
      ['pump', 'Unidade compacta ligada ao reservatório'],
      ['gear', 'Pré-aquecedor e motores opcionais']
    ]
  },
  'separador-magnetico': {
    line: 'Barras magnéticas que retêm partículas metálicas no tanque.',
    volume: 'Consulte',
    apps: ['metalico'],
    vols: [],
    highlights: [
      ['magnet', 'Campo magnético retém partículas metálicas'],
      ['check', 'Funciona de forma semipermanente, sem custo de operação'],
      ['gear', 'Pouca manutenção por muito tempo'],
      ['drop', 'Para óleo solúvel e óleos básicos']
    ]
  },
  'serie-trap-transportador-magnetico': {
    line: 'Separador magnético com rolo de compressão de lodo.',
    volume: 'Vazão de 40 a 200 L/min',
    apps: ['metalico'],
    vols: [],
    highlights: [
      ['magnet', 'Ímãs de filtração para partículas metálicas'],
      ['gear', 'Rolo de compressão de lodo'],
      ['flow', 'Vazões de 40 a 200 L/min'],
      ['check', 'Baixo custo de operação e fácil manuseio']
    ]
  },
  'desareador-quicktron': {
    line: 'Remove as bolhas de ar do óleo em injetoras e hidráulica.',
    volume: 'Vazão de até 100 L/min',
    apps: ['ar', 'hidraulico'],
    vols: [],
    highlights: [
      ['air', 'Separa as bolhas de ar do fluxo de óleo'],
      ['shield', 'Aço inox AISI 316 (versões SUS)'],
      ['flow', 'Vazões de até 100 L/min'],
      ['gauge', 'Até 10 bar e 120 °C']
    ]
  },
  'caminhao-de-filtragem': {
    line: 'Unidade móvel para prestadores de serviço de filtragem.',
    volume: 'Volumes de até 50.000 L',
    apps: ['hidraulico', 'lubrificacao', 'motor'],
    vols: ['v2', 'v3'],
    highlights: [
      ['truck', 'Unidade móvel para serviços em campo'],
      ['flow', 'Vazões de 6 a 60 L/min'],
      ['tank', 'Volumes de óleo de até 50.000 L'],
      ['particle', 'Limpeza até NAS 5 ou melhor']
    ]
  }
};
