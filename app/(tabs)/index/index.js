import { useCallback } from "react";
import { View, Text, FlatList, Pressable, Alert, StyleSheet } from "react-native";
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
    }, [carregarRachas])
  );

  function abrirRacha(id) {
    router.push({ pathname: "/(tabs)/index/[id]", params: { id } });
  }

  function novoRacha() {
    router.push("/(tabs)/index/novo");
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
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success