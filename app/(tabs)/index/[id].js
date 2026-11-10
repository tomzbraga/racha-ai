import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { colors } from "../../../src/theme/colors";

export default function DetalheRacha() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Detalhe do racha: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.background,
  },
  text: {
    color: colors.text,
  },
});
