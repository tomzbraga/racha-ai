export function validarRacha({ nome, participantes }) {
  const erros = {};

  if (!nome.trim()) {
    erros.nome = "Informe o nome do racha.";
  }
  if (participantes.length === 0) {
    erros.participantes = "Adicione pelo menos um participante.";
  }

  return erros;
}

// Aceita "12,50", "12.50" e "1.234,56" (ponto como milhar, vírgula como decimal)
export function converterValor(texto) {
  const limpo = String(texto).trim().replace(/[^\d.,]/g, "");
  const normalizado = limpo.includes(",")
    ? limpo.replace(/\./g, "").replace(",", ".")
    : limpo;
  return Number(normalizado);
}

export function validarItem({ descricao, valor, consumidoPor }) {
  const erros = {};

  if (!descricao.trim()) {
    erros.descricao = "Informe a descrição do item.";
  }

  const numero = converterValor(valor);
  if (!(numero > 0)) {
    erros.valor = "Informe um valor maior que zero.";
  }

  if (consumidoPor.length === 0) {
    erros.consumidoPor = "Selecione quem consumiu.";
  }

  return erros;
}
