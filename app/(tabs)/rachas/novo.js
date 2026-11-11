import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as Haptics from "expo-haptics";

import { useRachaStore } from "../../../src/store/useRachaStore";
import { validarRacha } from "../../../src/utils/validacoes";
import Button from "../../../src/components/Button";
import Input from "../../../src/components/Input";
import { colors } from "../../../src/theme/colors";

export default function NovoRacha() {
  const router = useRouter();
  const criarRacha = useRachaStore((s) => s.criarRacha);

  const [nome, setNome] = useState("");
  const [data, setData] = useState(new Date());
  const [mostrarPicker, setMostrarPicker] = useState(false);
  const [nomeParticipante, setNomeParticipante] = useState("");
  const [participantes, setParticipantes] = useState([]);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);

  function aoMudarData(event, selecionada) {
    // No Android o picker é um diálogo e fecha sozinho; no iOS fica inline
    setMostrarPicker(Platform.OS === "ios");
    if (selecionada) setData(selecionada);
  }

  function adicionarParticipante() {
    const nomeLimpo = nomeParticipante.trim();
    if (!nomeLimpo) return;

    const jaExiste = participantes.some(
      (p) => p.toLowerCase() === nomeLimpo.toLowerCase(),
    );
    if (jaExiste) {
      setErros((e) => ({
        ...e,
        participantes: "Esse participante já foi adicionado.",
      }));
      return;
    }

    setParticipantes((lista) => [...lista, nomeLimpo]);
    setNomeParticipante("");
    setErros((e) => ({ ...e, participantes: undefined }));
  }

  function removerParticipante(nomeRemover) {
    setParticipantes((lista) => lista.filter((p) => p !== nomeRemover));
  }

  async function salvar() {
    const errosValidacao = validarRacha({ nome, participantes });
    setErros(errosValidacao);

    if (Object.keys(errosValidacao).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setSalvando(true);
    try {
      await criarRacha({
        nome: nome.trim(),
        data,
        participantes,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (e) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert("Erro", "Não foi possível salvar o racha. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <Input
        label="Nome do racha"
        placeholder="Ex.: Churrasco de sábado"
        value={nome}
        onChangeText={(texto) => {
          setNome(texto);
          if (erros.nome) setErros((e) => ({ ...e, nome: undefined }));
        }}
        error={erros.nome}
      />

      <Text style={styles.label}>Data</Text>
      <Pressable
        style={styles.dataBotao}
        onPress={() => setMostrarPicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} color={colors.primary} />
        <Text style={styles.dataTexto}>{data.toLocaleDateString("pt-BR")}</Text>
      </Pressable>
      {mostrarPicker && (
        <DateTimePicker
          value={data}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={aoMudarData}
        />
      )}

      <Text style={[styles.label, styles.labelEspaco]}>Participantes</Text>
      <View style={styles.linhaParticipante}>
        <View style={styles.inputParticipante}>
          <Input
            placeholder="Nome do participante"
            value={nomeParticipante}
            onChangeText={setNomeParticipante}
            onSubmitEditing={adicionarParticipante}
            returnKeyType="done"
          />
        </View>
        <Pressable
          style={styles.botaoAdicionar}
          onPress={adicionarParticipante}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </Pressable>
      </View>
      {erros.participantes && (
        <Text style={styles.erro}>{erros.participantes}</Text>
      )}

      <View style={styles.chips}>
        {participantes.map((p) => (
          <View key={p} style={styles.chip}>
            <Text style={styles.chipTexto}>{p}</Text>
            <Pressable onPress={() => removerParticipante(p)} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={colors.muted} />
            </Pressable>
          </View>
        ))}
      </View>

      <View style={styles.salvar}>
        <Button
          title="Salvar racha"
          icon="checkmark"
          onPress={salvar}
          loading={salvando}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  conteudo: { padding: 16 },
  label: { color: colors.text, fontWeight: "600", marginBottom: 4 },
  labelEspaco: { marginTop: 16 },
  dataBotao: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  dataTexto: { fontSize: 16, color: colors.text },
  linhaParticipante: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  inputParticipante: { flex: 1 },
  botaoAdicionar: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    width: 46,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
  },
  erro: { color: colors.danger, fontSize: 13, marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  chipTexto: { color: colors.text },
  salvar: { marginTop: 24 },
});
