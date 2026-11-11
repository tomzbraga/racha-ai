import { create } from "zustand";
import * as service from "../services/rachaService";

export const useRachaStore = create((set, get) => ({
  rachas: [],
  rachaAtual: null,
  loading: false,
  error: null,

  // Carregamento: guarda o erro na store para a tela exibir
  carregarRachas: async (userId = null) => {
    set({ loading: true, error: null });
    try {
      const rachas = await service.listarRachas(userId);
      set({ rachas, loading: false });
    } catch (e) {
      set({ error: "Não foi possível carregar os rachas.", loading: false });
    }
  },

  carregarRacha: async (id) => {
    set({ loading: true, error: null });
    try {
      const racha = await service.buscarRacha(id);
      set({ rachaAtual: racha, loading: false });
    } catch (e) {
      set({ error: "Não foi possível carregar o racha.", loading: false });
    }
  },

  limparRachaAtual: () => set({ rachaAtual: null, error: null }),

  // Mutações: lançam o erro para a tela tratar (Alert, haptics etc.)
  criarRacha: async (dados) => {
    return service.criarRacha(dados);
  },

  atualizarRacha: async (id, dados) => {
    await service.atualizarRacha(id, dados);
    const racha = await service.buscarRacha(id);
    set((state) => ({
      rachaAtual: racha,
      rachas: state.rachas.map((r) => (r.id === id ? racha : r)),
    }));
  },

  excluirRacha: async (id) => {
    await service.excluirRacha(id);
    set((state) => ({ rachas: state.rachas.filter((r) => r.id !== id) }));
  },

  adicionarItem: async (rachaId, dados) => {
    const item = await service.adicionarItem(rachaId, dados);
    set((state) => ({
      rachaAtual: state.rachaAtual
        ? { ...state.rachaAtual, itens: [...state.rachaAtual.itens, item] }
        : state.rachaAtual,
    }));
  },

  removerItem: async (rachaId, itemId) => {
    await service.removerItem(rachaId, itemId);
    set((state) => ({
      rachaAtual: state.rachaAtual
        ? {
            ...state.rachaAtual,
            itens: state.rachaAtual.itens.filter((i) => i.id !== itemId),
          }
        : state.rachaAtual,
    }));
  },
}));
