import { useCallback, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { useLocalSearchParams, useFocusEffect, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useRachaStore } from "../../../src/store/useRachaStore";
import { validarItem, converterValor } from "../../../src/utils/validacoes";
import Button from "../../../src/components/Button";
import Input from "../../../src/components/Input";
import Card from "../../../src/components/Card";
import Loading from "../../../src/components/Loading";
import EmptyState from "../../../src/components/EmptyState";
import { colors } from "../../../src/theme/colors";

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function DetalheRacha() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const rachaAtual = useRachaStore((s) => s.rachaAtual);
  const error = useRachaStore((s) => s.error);
  const carregarRacha = useRachaStore((s) => s.carregarRacha);
  const adicionarItem = useRachaStore((s) => s.adicionarItem);
  const removerItem = useRachaStore((s) => s.removerItem);

  const [carregado, setCarregado] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [consumidoPor, setConsumidoPor] = useState([]);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  // Evita mostrar dados de outro racha que ficou na store
  const racha = rachaAtual?.id === id ? rachaAtual : null;

  useFocusEffect(
    useCallback(() => {
      carregarRacha(id).finally(() => setCarregado(true));
    }, [id, carregarRacha]),
  );

  function alternarConsumidor(nome) {
    setConsumidoPor((lista) =>
      lista.includes(nome) ? lista.filter((n) => n !== nome) : [...lista, nome],
    );
    setErros((e) => ({ ...e, consumidoPor: undefined }));
  }

  function selecionarTodos() {
    setConsumidoPor([...racha.participantes]);
    setErros((e) => ({ ...e, consumidoPor: undefined }));
  }

  function limparForm() {
    setDescricao("");
    setValor("");
    setConsumidoPor([]);
    setErros({});
  }

  async function salvarItem() {
    const errosValidacao = validarItem({ descricao, valor, consumidoPor });
    setErros(errosValidacao);

    if (Object.keys(errosValidacao).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setSalvando(true);
    try {
      await adicionarItem(id, {
        descricao: descricao.trim(),
        valor: converterValor(valor),
        consumidoPor,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      limparForm();
      setMostrarForm(false);
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Erro",
        "Não foi possível adicionar o item. Tente novamente.",
      );
    } finally {
      setSalvando(false);
    }
  }

  function confirmarRemocao(item) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert("Remover item", `Deseja remover "${item.descricao}"?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Remover",
        style: "destructive",
        onPress: async () => {
          try {
            await removerItem(id, item.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch (e) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            Alert.alert("Erro", "Não foi possível remover o item.");
          }
        },
      },
    ]);
  }

  if (!racha && !carregado) {
    return <Loading message="Carregando racha..." />;
  }

  if (!racha) {
    return (
      <EmptyState
        icon="alert-circle-outline"
        title="Racha não encontrado"
        message={error ?? "Ele pode ter sido excluído."}
      />
    );
  }

  const itens = racha.itens ?? [];
  const total = itens.reduce((soma, i) => soma + i.valor, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Card>
        <Text style={styles.nome}>{racha.nome}</Text>
        <Text style={styles.detalhe}>
          {racha.data ? racha.data.toLocaleDateString("pt-BR") : "Sem data"} •{" "}
          {racha.participantes.length}{" "}
          {racha.participantes.length === 1 ? "pessoa" : "pessoas"}
        </Text>
        <Text style={styles.participantes}>
          {racha.participantes.join(", ")}
        </Text>
        <Text style={styles.total}>Total: {formatarMoeda(total)}</Text>
      </Card>

      <Text style={styles.secao}>Itens</Text>

      {itens.length === 0 && !mostrarForm && (
        <Text style={styles.vazio}>
          Nenhum item ainda. Adicione o primeiro.
        </Text>
      )}

      {itens.map((item) => (
        <Card key={item.id} style={styles.itemCard}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemNome}>{item.descricao}</Text>
            <Text style={styles.itemConsumo}>
              {item.consumidoPor.join(", ")}
            </Text>
          </View>
          <Text style={styles.itemValor}>{formatarMoeda(item.valor)}</Text>
          <Pressable
            onPress={() => confirmarRemocao(item)}
            hitSlop={12}
            style={styles.lixeira}
          >
            <Ionicons name="trash-outline" size={20} color={colors.danger} />
          </Pressable>
        </Card>
      ))}

      {mostrarForm ? (
        <Card>
          <Input
            label="Descrição"
            placeholder="Ex.: Picanha"
            value={descricao}
            onChangeText={(t) => {
              setDescricao(t);
              if (erros.descricao)
                setErros((e) => ({ ...e, descricao: undefined }));
            }}
            error={erros.descricao}
          />
          <Input
            label="Valor (R$)"
            placeholder="0,00"
            keyboardType="decimal-pad"
            value={valor}
            onChangeText={(t) => {
              setValor(t);
              if (erros.valor) setErros((e) => ({ ...e, valor: undefined }));
            }}
            error={erros.valor}
          />

          <View style={styles.consumoHeader}>
            <Text style={styles.label}>Quem consumiu</Text>
            <Pressable onPress={selecionarTodos} hitSlop={8}>
              <Text style={styles.link}>Selecionar todos</Text>
            </Pressable>
          </View>
          <View style={styles.chips}>
            {racha.participantes.map((nome) => {
              const ativo = consumidoPor.includes(nome);
              return (
                <Pressable
                  key={nome}
                  onPress={() => alternarConsumidor(nome)}
                  style={[styles.chip, ativo && styles.chipAtivo]}
                >
                  <Text
                    style={[styles.chipTexto, ativo && styles.chipTextoAtivo]}
                  >
                    {nome}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {erros.consumidoPor && (
            <Text style={styles.erro}>{erros.consumidoPor}</Text>
          )}

          <View style={styles.botoesForm}>
            <View style={styles.botaoMetade}>
              <Button
                title="Cancelar"
                variant="outline"
                onPress={() => {
                  limparForm();
                  setMostrarForm(false);
                }}
              />
            </View>
            <View style={styles.botaoMetade}>
              <Button
                title="Adicionar"
                icon="checkmark"
                onPress={salvarItem}
                loading={salvando}
              />
            </View>
          </View>
        </Card>
      ) : (
        <Button
          title="Adicionar item"
          icon="add"
          variant="outline"
          onPress={() => setMostrarForm(true)}
        />
      )}

      <View style={styles.resumo}>
        <Button
          title="Ver resumo da divisão"
          icon="calculator-outline"
          onPress={() => router.push("/resumo")}
          disabled={itens.length === 0}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: 16 },
  nome: { fontSize: 20, fontWeight: "700", color: colors.text },
  detalhe: { marginTop: 2, color: colors.muted },
  participantes: { marginTop: 4, color: colors.muted },
  total: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: "700",
    color: colors.primary,
  },
  secao: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginVertical: 8,
  },
  vazio: { color: colors.muted, marginBottom: 12 },
  itemCard: { flexDirection: "row", alignItems: "center" },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 16, fontWeight: "600", color: colors.text },
  itemConsumo: { marginTop: 2, color: colors.muted, fontSize: 13 },
  itemValor: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginHorizontal: 8,
  },
  lixeira: { padding: 4 },
  consumoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: { color: colors.text, fontWeight: "600" },
  link: { color: colors.primary, fontWeight: "600" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipAtivo: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTexto: { color: colors.text },
  chipTextoAtivo: { color: "#FFFFFF", fontWeight: "600" },
  erro: { color: colors.danger, fontSize: 13, marginTop: 6 },
  botoesForm: { flexDirection: "row", gap: 8, marginTop: 16 },
  botaoMetade: { flex: 1 },
  resumo: { marginTop: 24 },
});
