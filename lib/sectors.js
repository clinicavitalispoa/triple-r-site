// Sector content in one short format: problem → where to apply → result → proof → products.
// Source: content review (Nov/2026). Items marked "TODO" in the review were left out until the
// client confirms a real case or number; product lines still need validation by the technical team.
export const SECTORS = [
  {
    slug: 'injetoras-de-plastico',
    nome: 'Injetoras de Plástico',
    chamada: 'Menos verniz nas válvulas, menos parada de máquina.',
    problema: 'O óleo hidráulico trabalha quente o dia todo, oxida e forma verniz, que trava servoválvulas e derruba a repetibilidade do ciclo.',
    ondeAplicar: ['Injetoras', 'Sopradoras', 'Prensas hidráulicas', 'Unidades hidráulicas centrais'],
    resultado: 'Válvulas limpas, ciclo estável e óleo trocado com muito menos frequência.',
    prova: 'Mais de 100.000 instalações em injetoras no mundo.',
    produtos: ['serie-bu', 'serie-se', 'elementos-filtrantes']
  },
  {
    slug: 'fabricantes-de-automoveis',
    nome: 'Fabricantes de Automóveis',
    chamada: 'Linhas de estampagem e robôs sem parada por óleo sujo.',
    problema: 'Partículas metálicas e poeira da produção entram no sistema hidráulico e desgastam bombas, cilindros e válvulas.',
    ondeAplicar: ['Prensas de estampagem', 'Robôs e manipuladores', 'Centros de usinagem', 'Sistemas hidráulicos da linha'],
    resultado: 'Menos troca de componentes e mais vida útil para o ferramental.',
    prova: 'Clientes como General Motors, Ford, Mercedes-Benz e Nissan.',
    produtos: ['serie-bu', 'serie-se', 'separador-magnetico']
  },
  {
    slug: 'setor-sucroenergetico',
    nome: 'Setor Sucroenergético',
    chamada: 'Moenda girando a safra inteira.',
    problema: 'Caldo, água e bagaço contaminam o óleo de moendas e redutores. Na safra, cada hora parada custa caro.',
    ondeAplicar: ['Moendas', 'Redutores', 'Turbinas a vapor', 'Sistemas hidráulicos da usina'],
    resultado: 'Óleo seco e limpo durante toda a safra, com menos quebra de redutor.',
    prova: 'Clientes como Raízen e Biosev.',
    produtos: ['desidratador-a-vacuo-termovacuo', 'serie-bu', 'serie-osca']
  },
  {
    slug: 'industria-de-papel-e-celulose',
    nome: 'Papel e Celulose',
    chamada: 'Umidade fora do óleo, máquina de papel rodando.',
    problema: 'Vapor e umidade do processo entram no óleo de lubrificação, causam oxidação e corroem rolamentos.',
    ondeAplicar: ['Lubrificação circulante da máquina de papel', 'Prensas', 'Redutores', 'Sistemas hidráulicos'],
    resultado: 'Rolamentos protegidos e óleo durando muito mais.',
    produtos: ['desidratador-a-vacuo-termovacuo', 'serie-bu']
  },
  {
    slug: 'energia-eolica',
    nome: 'Energia Eólica',
    chamada: 'Menos subidas na torre, mais energia gerada.',
    problema: 'Condensação e partículas de desgaste atacam a caixa multiplicadora. Trocar óleo ou componente lá em cima exige guindaste e parada longa.',
    ondeAplicar: ['Caixa multiplicadora', 'Sistema hidráulico de pitch', 'Sistema de yaw'],
    resultado: 'Óleo limpo por mais tempo e menos intervenções na nacele.',
    produtos: ['serie-bu', 'elementos-filtrantes']
  },
  {
    slug: 'maritimo',
    nome: 'Marítimo',
    chamada: 'Óleo limpo em alto-mar, longe de qualquer oficina.',
    problema: 'Água salgada e fuligem contaminam o óleo de motores, propulsão e guindastes, e no mar não dá para parar.',
    ondeAplicar: ['Motores diesel', 'Propulsores e leme', 'Guindastes de convés', 'Hidráulica de bordo'],
    resultado: 'Menos troca de óleo a bordo e equipamentos protegidos contra corrosão.',
    produtos: ['serie-bu', 'desidratador-a-vacuo-termovacuo']
  },
  {
    slug: 'transporte',
    nome: 'Transporte',
    chamada: 'Frota mais tempo na estrada, menos tempo na oficina.',
    problema: 'Fuligem e partículas saturam o óleo do motor antes do fim do intervalo de troca.',
    ondeAplicar: ['Caminhões', 'Ônibus', 'Locomotivas', 'Hidráulica de implementos'],
    resultado: 'Intervalos de troca maiores e menos desgaste do motor, com instalação simples.',
    produtos: ['serie-bu', 'elementos-filtrantes']
  },
  {
    slug: 'petroquimica',
    nome: 'Petroquímica',
    chamada: 'Operação contínua exige óleo sempre limpo.',
    problema: 'Turbinas, compressores e bombas operam 24 horas. Água e verniz no óleo provocam paradas não programadas.',
    ondeAplicar: ['Turbinas', 'Compressores', 'Bombas', 'Sistemas de selagem'],
    resultado: 'Equipamentos críticos protegidos e menos paradas não planejadas.',
    prova: 'Recomendada pela AkzoNobel.',
    produtos: ['desidratador-a-vacuo-termovacuo', 'serie-bu', 'serie-se']
  },
  {
    slug: 'extrusao-de-aluminio',
    nome: 'Extrusão de Alumínio',
    chamada: 'Prensa grande, óleo limpo, zero travamento.',
    problema: 'Prensas com milhares de litros de óleo trabalham em alta temperatura, e o verniz e as partículas travam válvulas e desgastam bombas.',
    ondeAplicar: ['Prensas de extrusão', 'Unidades hidráulicas', 'Sistemas de corte e puxador'],
    resultado: 'Menos travamentos e economia grande em troca de óleo, pelo volume do sistema.',
    produtos: ['serie-bu', 'serie-se']
  },
  {
    slug: 'maquinas-de-construcao',
    nome: 'Máquinas de Construção',
    chamada: 'Poeira fica no canteiro, não no óleo.',
    problema: 'Poeira e água entram no sistema hidráulico de máquinas que trabalham no tempo e desgastam bombas e cilindros.',
    ondeAplicar: ['Escavadeiras', 'Pás-carregadeiras', 'Guindastes', 'Perfuratrizes'],
    resultado: 'Menos quebra de componente hidráulico e máquina mais tempo na obra.',
    produtos: ['serie-bu', 'elementos-filtrantes']
  },
  {
    slug: 'prestadores-de-servicos-de-filtragem-de-oleo',
    nome: 'Prestadores de Serviço de Filtragem',
    chamada: 'Equipamento para quem limpa óleo de outras empresas.',
    problema: 'Quem presta serviço de filtragem atende fluidos e máquinas diferentes todo dia e precisa de equipamento móvel e versátil.',
    ondeAplicar: ['Filtragem em campo', 'Flushing de sistemas', 'Troca e recuperação de óleo', 'Atendimento a vários clientes'],
    resultado: 'Um equipamento só para vários tipos de óleo, com serviço de maior valor para o seu cliente.',
    produtos: ['caminhao-de-filtragem', 'serie-tr', 'desidratador-a-vacuo-termovacuo']
  }
];

export const HOME_SECTORS = ['injetoras-de-plastico', 'fabricantes-de-automoveis', 'setor-sucroenergetico', 'industria-de-papel-e-celulose', 'energia-eolica', 'petroquimica'];
