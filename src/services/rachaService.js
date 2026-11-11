import {
  collection,
  setDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  arrayUnion,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebaseConnection";

const rachasRef = collection(db, "rachas");

const ESPERA_CONFIRMACAO_MS = 2000;

// Espera a gravação por até 2s. Se o Firestore recusar antes disso
// (ex.: permissão), o erro sobe para a tela. Se só demorar a confirmar,
// segue em frente: a gravação continua pendente e é enviada assim que possível.
function aguardarGravacao(gravacao) {
  gravacao.catch((e) => console.error("Erro na gravação:", e));
  return Promise.race([
    gravacao,
    new Promise((resolve) => setTimeout(resolve, ESPERA_CONFIRMACAO_MS)),
  ]);
}

// Converte o documento do Firestore para objeto JS (Timestamp -> Date)
function mapDoc(snap) {
  const d = snap.data();
  return {
    id: snap.id,
    ...d,
    data: d.data?.toDate ? d.data.toDate() : d.data,
  };
}

// CREATE
export async function criarRacha({
  nome,
  data,
  participantes = [],
  gorjetaPercent = 0,
  userId = null,
}) {
  const ref = doc(rachasRef); // gera o id localmente
  await aguardarGravacao(
    setDoc(ref, {
      nome,
      data: Timestamp.fromDate(data),
      participantes,
      gorjetaPercent,
      userId,
      itens: [],
    }),
  );
  return ref.id;
}

// READ (lista). Se passar userId, filtra só os rachas do usuário
export async function listarRachas(userId = null) {
  const q = userId
    ? query(rachasRef, where("userId", "==", userId))
    : rachasRef;
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc).sort((a, b) => b.data - a.data); // mais recentes primeiro
}

// READ (um racha)
export async function buscarRacha(id) {
  const snap = await getDoc(doc(db, "rachas", id));
  return snap.exists() ? mapDoc(snap) : null;
}

// UPDATE (nome, data, participantes, gorjetaPercent...)
export async function atualizarRacha(id, dados) {
  const payload = { ...dados };
  if (payload.data instanceof Date) {
    payload.data = Timestamp.fromDate(payload.data);
  }
  await aguardarGravacao(updateDoc(doc(db, "rachas", id), payload));
}

// DELETE
export async function excluirRacha(id) {
  await aguardarGravacao(deleteDoc(doc(db, "rachas", id)));
}

// ITENS: adicionar
export async function adicionarItem(
  rachaId,
  { descricao, valor, consumidoPor },
) {
  const item = {
    id: Date.now().toString(),
    descricao,
    valor,
    consumidoPor,
  };
  await aguardarGravacao(
    updateDoc(doc(db, "rachas", rachaId), { itens: arrayUnion(item) }),
  );
  return item;
}

// ITENS: remover
export async function removerItem(rachaId, itemId) {
  const racha = await buscarRacha(rachaId);
  if (!racha) return;
  const itens = racha.itens.filter((i) => i.id !== itemId);
  await aguardarGravacao(updateDoc(doc(db, "rachas", rachaId), { itens }));
}
