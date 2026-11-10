import { Button } from "react-native";
import { useRachaStore } from "../../../src/store/useRachaStore";

export default function NovoRacha() {
  const criarRacha = useRachaStore((s) => s.criarRacha);
  return (
    <Button
      title="Criar teste"
      onPress={() =>
        criarRacha({
          nome: "Churrasco",
          data: new Date(),
          participantes: ["Ana", "Beto"],
        })
      }
    />
  );
}
