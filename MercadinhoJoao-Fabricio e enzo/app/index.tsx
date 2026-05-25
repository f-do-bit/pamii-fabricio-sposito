import FormularioEntrega from "@/src/screens/FormularioEntrega";
import ConsultaEntrega from "@/src/screens/ConsultaEntrega";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";

export default function Index() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={{ flex: 1, backgroundColor: "#f0f2f5" }}
        contentContainerStyle={{ padding: 20 }}
      >
        <FormularioEntrega />
        <ConsultaEntrega />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
