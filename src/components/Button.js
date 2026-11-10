import { Pressable, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";

export default function Button({
  title,
  onPress,
  variant = "primary", // "primary" | "outline" | "danger"
  icon,
  loading = false,
  disabled = false,
}) {
  const isOutline = variant === "outline";
  const bg =
    variant === "danger"
      ? colors.danger
      : isOutline
        ? "transparent"
        : colors.primary;
  const fg = isOutline ? colors.primary : "#FFFFFF";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: bg, borderColor: isOutline ? colors.primary : bg },
        (pressed || disabled || loading) && styles.dimmed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon && <Ionicons name={icon} size={18} color={fg} />}
          <Text style={[styles.text, { color: fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  text: { fontSize: 16, fontWeight: "600" },
  dimmed: { opacity: 0.6 },
});
