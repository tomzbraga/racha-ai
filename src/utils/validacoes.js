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

// Aceita "12,50" ou "12.50"
export function converterValor(texto) {
  return parseFloat(String(texto).replace(",", "."));
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
