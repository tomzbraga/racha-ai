import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import { useRachaStore } from "../../src/store/useRachaStore";
import { calcularDivisao } from "../../src/utils/calcularDivisao";
import { converterValor } from "../../src/utils/validacoes";
import Button from "../../src/components/Button";
import Input from "../../src/components/Input";
import Card from "../../src/components/Card";
import EmptyState from "../../src/components/EmptyState";
import { colors } from "../../src/theme/colors";

const GORJETAS_RAPIDAS = [0, 5, 10, 15];

function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export default function Resumo() {
  const router = useRouter();

  const rachaAtual = useRachaStore((s) => s.rachaAtual);
  const atualizarRacha = useRachaStore((s) => s.atualizarRacha);

  const [gorjeta, setGorjeta] = useState(0);
  const [textoGorjeta, setTextoGorjeta] = useState("0");

  // Quando muda o racha aberto, carrega a gorjeta salva nele
  useEffect(() => {
    const salva = rachaAtual?.gorjetaPercent ?? 0;
    setGorjeta(salva);
    setTextoGorjeta(String(salva));
  }, [rachaAtual?.id]);

  async function definirGorjeta(percentual) {
    const valido = Math.min(Math.max(percentual || 0, 0), 100);
    setGorjeta(valido);
    setTextoGorjeta(String(valido));
    Haptics.selectionAsync();

    // Persiste no Firestore; se falhar, a gorjeta continua valendo só na tela
    try {
      await atualizarRacha(rachaAtual.id, { gorjetaPercent: valido });
    } catch (e) {}
  }

  if (!rachaAtual) {
    return (
      <View style={styles.vazio}>
        <EmptyState
          icon="calculator-outline"
          title="Nenhum racha selecionado"
          message="Abra um racha em Meus Rachas para ver a divisão."
        />
        <Button
          title="Ir para Meus Rachas"
          variant="outline"
          onPress={() => router.push("/rachas")}
        />
      </View>
    );
  }

  const resultado = calcularDivisao({
    participantes: rachaAtual.participantes,
    itens: rachaAtual.itens ?? [],
    gorjetaPercent: gorjeta,
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.titulo}>{rachaAtual.nome}</Text>

      <Card>
        <Text style={styles.label}>Gorjeta (%)</Text>
        <View style={styles.chips}>
          {GORJETAS_RAPIDAS.map((p) => (
            <Pressable
              key={p}
              onPress={() => definirGorjeta(p)}
              style={[styles.chip, gorjeta === p && styles.chipAtivo]}
            >
              <Text
                style={[
                  styles.chipTexto,
                  gorjeta === p && styles.chipTextoAtivo,
                ]}
              >
                {p}%
              </Text>
            </Pressable>
          ))}
        </View>
        <Input
          placeholder="Outro valor"
          keyboardType="decimal-pad"
          value={textoGorjeta}
          onChangeText={setTextoGorjeta}
          onEndEditing={() => definirGorjeta(converterValor(textoGorjeta))}
        />
      </Card>

      <Card style={styles.totais}>
        <View style={styles.linha}>
          <Text style={styles.linhaTexto}>Itens</Text>
          <Text style={styles.linhaValor}>
            {formatarMoeda(resultado.totalItens)}
          </Text>
        </View>
        <View style={styles.linha}>
          <Text style={styles.linhaTexto}>Gorjeta</Text>
          <Text style={styles.linhaValor}>
            {formatarMoeda(resultado.totalGorjeta)}
          </Text>
        </View>
        <View style={[styles.linha, styles.linhaTotal]}>
          <Text style={styles.totalTexto}>Total geral</Text>
          <Text style={styles.totalValor}>
            {formatarMoeda(resultado.totalGeral)}
          </Text>
        </View>
      </Card>

      <Text style={styles.secao}>Cada pessoa paga</Text>

      {resultado.porPessoa.map((p) => (
        <Card key={p.nome} style={styles.pessoa}>
          <View style={styles.pessoaInfo}>
            <Text style={styles.pessoaNome}>{p.nome}</Text>
            <Text style={styles.pessoaDetalhe}>
              {formatarMoeda(p.subtotal)} + {formatarMoeda(p.gorjeta)} de
              gorjeta
            </Text>
          </View>
          <Text style={styles.pessoaTotal}>{formatarMoeda(p.total)}</Text>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: 16 },
  vazio: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
    justifyContent: "center",
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 12,
  },
  label: { color: colors.text, fontWeight: "600", marginBottom: 8 },
  chips: { flexDirection: "row", gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 14,
  },
  chipAtivo: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTexto: { color: colors.text },
  chipTextoAtivo: { color: "#FFFFFF", fontWeight: "600" },
  totais: { gap: 6 },
  linha: { flexDirection: "row", justifyContent: "space-between" },
  linhaTexto: { color: colors.muted },
  linhaValor: { color: colors.text, fontWeight: "600" },
  linhaTotal: {
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalTexto: { fontSize: 16, fontWeight: "700", color: colors.text },
  totalValor: { fontSize: 18, fontWeight: "700", color: colors.primary },
  secao: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginVertical: 8,
  },
  pessoa: { flexDirection: "row", alignItems: "center" },
  pessoaInfo: { flex: 1 },
  pessoaNome: { fontSize: 17, fontWeight: "700", color: colors.text },
  pessoaDetalhe: { marginTop: 2, color: colors.muted, fontSize: 13 },
  pessoaTotal: { fontSize: 18, fontWeight: "700", color: colors.primary },
});
