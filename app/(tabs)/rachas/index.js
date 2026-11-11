import { useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Alert,
  StyleSheet,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { useRachaStore } from "../../../src/store/useRachaStore";
import Button from "../../../src/components/Button";
import Card from "../../../src/components/Card";
import Loading from "../../../src/components/Loading";
import EmptyState from "../../../src/components/EmptyState";
import { colors } from "../../../src/theme/colors";

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function ListaRachas() {
  const router = useRouter();

  const rachas = useRachaStore((s) => s.rachas);
  const loading = useRachaStore((s) => s.loading);
  const error = useRachaStore((s) => s.error);
  const carregarRachas = useRachaStore((s) => s.carregarRachas);
  const excluirRacha = useRachaStore((s) => s.excluirRacha);

  useFocusEffect(
    useCallback(() => {
      carregarRachas();
    }, [carregarRachas]),
  );

  function abrirRacha(id) {
    router.push(`/rachas/${id}`);
  }

  function novoRacha() {
    router.push("/rachas/novo");
  }

  function confirmarExclusao(racha) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Excluir racha",
      `Deseja excluir "${racha.nome}"? Essa ação não pode ser desfeita.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await excluirRacha(racha.id);
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
            } catch (e) {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
              Alert.alert("Erro", "Não foi possível excluir o racha.");
            }
          },
        },
      ],
    );
  }

  function renderItem({ item }) {
    const total = (item.itens ?? []).reduce((soma, i) => soma + i.valor, 0);
    const qtdParticipantes = item.participantes?.length ?? 0;

    return (
      <Pressable onPress={() => abrirRacha(item.id)}>
        <Card style={styles.card}>
          <View style={styles.info}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text style={styles.detalhe}>
              {item.data ? item.data.toLocaleDateString("pt-BR") : "Sem data"} •{" "}
              {qtdParticipantes} {qtdParticipantes === 1 ? "pessoa" : "pessoas"}
            </Text>
            <Text style={styles.total}>{formatarMoeda(total)}</Text>
          </View>
          <Pressable
            onPress={() => confirmarExclusao(item)}
            hitSlop={12}
            style={styles.lixeira}
          >
            <Ionicons name="trash-outline" size={22} color={colors.danger} />
          </Pressable>
        </Card>
      </Pressable>
    );
  }

  function renderConteudo() {
    if (loading && rachas.length === 0) {
      return <Loading message="Carregando rachas..." />;
    }

    if (error && rachas.length === 0) {
      return (
        <View style={styles.centro}>
          <EmptyState
            icon="cloud-offline-outline"
            title="Ops!"
            message={error}
          />
          <Button
            title="Tentar novamente"
            variant="outline"
            icon="refresh"
            onPress={() => carregarRachas()}
          />
        </View>
      );
    }

    if (rachas.length === 0) {
      return (
        <EmptyState
          icon="receipt-outline"
          title="Nenhum racha ainda"
          message="Crie o primeiro para dividir a conta com a galera."
        />
      );
    }

    return (
      <FlatList
        data={rachas}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.lista}
        refreshing={loading}
        onRefresh={() => carregarRachas()}
      />
    );
  }

  return (
    <View style={styles.container}>
      {renderConteudo()}
      <View style={styles.rodape}>
        <Button title="Novo racha" icon="add" onPress={novoRacha} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  lista: { padding: 16 },
  centro: { flex: 1, justifyContent: "center", padding: 16 },
  card: { flexDirection: "row", alignItems: "center" },
  info: { flex: 1 },
  nome: { fontSize: 18, fontWeight: "700", color: colors.text },
  detalhe: { marginTop: 2, color: colors.muted },
  total: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "600",
    color: colors.primary,
  },
  lixeira: { padding: 4 },
  rodape: {
    padding: 16,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
