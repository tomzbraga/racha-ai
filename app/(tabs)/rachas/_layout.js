import { Stack } from "expo-router";
import { colors } from "../../../src/theme/colors";

export default function RachasStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTitleStyle: { color: colors.text },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Meus Rachas" }} />
      <Stack.Screen name="[id]" options={{ title: "Detalhe do racha" }} />
      <Stack.Screen name="novo" options={{ title: "Novo racha" }} />
    </Stack>
  );
}
