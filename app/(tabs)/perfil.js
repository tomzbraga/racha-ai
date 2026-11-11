import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Card from "../../src/components/Card";
import { colors } from "../../src/theme/colors";

// Tela estática, só para apresentação do projeto.
const TECNOLOGIAS = [
  "React Native",
  "Expo",
  "Expo Router",
  "Zustand",
  "Firebase Firestore",
  "Haptics",
  "DateTimePicker",
];

const RECURSOS = [
  { icone: "receipt-outline", texto: "Crie rachas com data e participantes" },
  { icone: "list-outline", texto: "Adicione itens e marque quem consumiu" },
  { icone: "calculator-outline", texto: "Divisão justa, item a item, com gorjeta" },
  { icone: "cloud-done-outline", texto: "Dados salvos na nuvem com Firestore" },
];

function Linha({ icone, titulo, valor }) {
  return (
    <View style={styles.linha}>
      <Ionicons name={icone} size={20} color={colors.primary} />
      <View style={styles.linhaTextos}>
        <Text style={styles.linhaTitulo}>{titulo}</Text>
        <Text style={styles.linhaValor}>{valor}</Text>
      </View>
    </View>
  );
}

export default function Perfil() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.conteudo}>
      <View style={styles.topo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTexto}>L</Text>
        </View>
        <Text style={styles.nome}>Lucas</Text>
        <Text style={styles.subtitulo}>
          Análise e Desenvolvimento de Sistemas
        </Text>
      </View>

      <Card>
        <Linha icone="school-outline" titulo="Curso" valor="ADS" />
        <Linha
          icone="logo-github"
          titulo="GitHub"
          valor="github.com/tomzbraga"
        />
        <Linha
          icone="phone-portrait-outline"
          titulo="Projeto"
          valor="RachaAí — Projeto final de React Native"
        />
      </Card>

      <Text style={styles.secao}>Sobre o RachaAí</Text>
      <Card>
        <Text style={styles.descricao}>
          App para dividir a conta de forma justa: cada item é dividido apenas
          entre quem consumiu, e a gorjeta é somada no final.
        </Text>
        {RECURSOS.map((r) => (
          <View key={r.texto} style={styles.recurso}>
            <Ionicons name={r.icone} size={18} color={colors.primary} />
            <Text style={styles.recursoTexto}>{r.texto}</Text>
          </View>
        ))}
      </Card>

      <Text style={styles.secao}>Tecnologias</Text>
      <View style={styles.chips}>
        {TECNOLOGIAS.map((t) => (
          <View key={t} style={styles.chip}>
            <Text style={styles.chipTexto}>{t}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.versao}>RachaAí v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: 16, paddingBottom: 32 },
  topo: { alignItems: "center", marginVertical: 20 },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTexto: { fontSize: 40, fontWeight: "700", color: "#FFFFFF" },
  nome: { marginTop: 12, fontSize: 24, fontWeight: "700", color: colors.text },
  subtitulo: { marginTop: 2, color: colors.muted },
  linha: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 8 },
  linhaTextos: { flex: 1 },
  linhaTitulo: { color: colors.muted, fontSize: 13 },
  linhaValor: { color: colors.text, fontSize: 16, fontWeight: "600" },
  secao: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: 8,
    marginBottom: 8,
  },
  descricao: { color: colors.text, lineHeight: 22, marginBottom: 8 },
  recurso: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 6 },
  recursoTexto: { flex: 1, color: colors.text },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipTexto: { color: colors.text },
  versao: { marginTop: 24, textAlign: "center", color: colors.muted },
});
