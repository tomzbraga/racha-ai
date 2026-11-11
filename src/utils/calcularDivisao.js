// Calcula quanto cada participante paga.
// Trabalha em centavos para evitar erros de ponto flutuante.
export function calcularDivisao({
  participantes = [],
  itens = [],
  gorjetaPercent = 0,
}) {
  const subtotais = {};
  participantes.forEach((nome) => {
    subtotais[nome] = 0;
  });

  let totalItensCentavos = 0;

  itens.forEach((item) => {
    const centavos = Math.round(item.valor * 100);
    totalItensCentavos += centavos;

    // Se por algum motivo ninguém foi marcado, divide entre todos
    const consumidores = item.consumidoPor?.length
      ? item.consumidoPor
      : participantes;
    if (consumidores.length === 0) return;

    const base = Math.floor(centavos / consumidores.length);
    let resto = centavos - base * consumidores.length;

    // Os centavos que sobram vão um a um para os primeiros consumidores
    consumidores.forEach((nome) => {
      subtotais[nome] = (subtotais[nome] ?? 0) + base + (resto > 0 ? 1 : 0);
      if (resto > 0) resto -= 1;
    });
  });

  let totalGorjetaCentavos = 0;

  const porPessoa = Object.keys(subtotais).map((nome) => {
    const subtotal = subtotais[nome];
    const gorjeta = Math.round((subtotal * gorjetaPercent) / 100);
    totalGorjetaCentavos += gorjeta;

    return {
      nome,
      subtotal: subtotal / 100,
      gorjeta: gorjeta / 100,
      total: (subtotal + gorjeta) / 100,
    };
  });

  return {
    porPessoa,
    totalItens: totalItensCentavos / 100,
    totalGorjeta: totalGorjetaCentavos / 100,
    totalGeral: (totalItensCentavos + totalGorjetaCentavos) / 100,
  };
}
