const FAQ = [
  ['Qual a diferença entre filtragem e purificação?', 'A filtragem é focada na remoção de partículas sólidas visíveis. A purificação é um processo mais amplo, que elimina também água, verniz, borra e resíduos de oxidação, garantindo a qualidade do fluido tratado.'],
  ['A Triple R remove água do óleo?', 'Sim. O meio filtrante de celulose absorve gotas de água e seca o óleo a menos de 100 ppm, além de reter partículas sólidas, borra e verniz no mesmo elemento.'],
  ['Todos os tipos de óleo podem ser purificados?', 'Diversos tipos: lubrificante, de corte, hidráulico, isolante, protetivo, solúvel e térmico, entre outros. Consulte nossa equipe para o seu caso.'],
  ['Quais as vantagens para o meu maquinário?', 'Maior vida útil de peças e do óleo, equipamentos mais precisos e confiáveis, menos paradas e redução de até 80% nos custos de manutenção ligados à contaminação.']
];

export default function Faq() {
  return (
    <div className="faq">
      {FAQ.map(([q, a]) => (
        <details key={q}>
          <summary>{q}</summary>
          <p>{a}</p>
        </details>
      ))}
    </div>
  );
}
