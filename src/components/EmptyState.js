import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function EmptyState({
  icon = "file-tray-outline",
  title,
  message,
}) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={56} color={colors.muted} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: { marginTop: 12, fontSize: 18, fontWeight: "600", color: colors.text },
  message: { marginTop: 4, textAlign: "center", color: colors.muted },
});
