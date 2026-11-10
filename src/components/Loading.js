import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import { colors } from "../theme/colors";

export default function Loading({ message }) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={colors.primary} />
      {message && <Text style={styles.text}>{message}</Text>}
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
  text: { marginTop: 12, color: colors.muted },
});
