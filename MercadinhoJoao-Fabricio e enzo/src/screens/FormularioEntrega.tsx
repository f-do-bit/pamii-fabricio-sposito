import { yupResolver } from "@hookform/resolvers/yup";
import {
   addDoc,
   collection,
   serverTimestamp,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import {
   ActivityIndicator,
   Alert,
   Animated,
   StyleSheet,
   Text,
   TextInput,
   TouchableOpacity,
   View,
} from "react-native";
import { db } from "../services/firebaseConfig";
import { Entregador, Fornecedor, schema } from "../types/entrega";

// Unimos os tipos para o formulário
type FormData = Fornecedor & Entregador;

// Criamos um componente animado para o TouchableOpacity
const AnimatedTouchableOpacity =
   Animated.createAnimatedComponent(TouchableOpacity);

export default function FormularioEntrega() {
   const [loading, setLoading] = useState(false);
   const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm<FormData>({
      resolver: yupResolver(schema),
   });

   // Referência para o valor da animação (0 a 1)
   const animValue = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      // Cria uma animação em loop (vai e volta)
      Animated.loop(
         Animated.sequence([
            Animated.timing(animValue, {
               toValue: 1,
               duration: 2000,
               useNativeDriver: false,
            }),
            Animated.timing(animValue, {
               toValue: 0,
               duration: 2000,
               useNativeDriver: false,
            }),
         ]),
      ).start();
   }, [animValue]);

   // Interpolação de cores (Azul para Roxo, por exemplo)
   const animatedColor = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["#4B3D5F", "#9146FF"], // Azul original para um Roxo
   });

   // O dado que vem do formulário
   const handleCadastro = async (data: FormData) => {
      try {
         setLoading(true);

         // 1. Criar documento do Fornecedor
         const fornecedorRef = await addDoc(collection(db, "fornecedores"), {
            nome_empresa: data.nome_empresa,
            nome_produto: data.nome_produto,
            num_pedido: data.num_pedido,
            quantidade_produto: data.quantidade_produto,
            assinatura: "",
            criado_em: serverTimestamp(),
         });

         // 2. Criar Entregador como uma subcoleção do Fornecedor recém-criado
         await addDoc(
            collection(db, "fornecedores", fornecedorRef.id, "entregadores"),
            {
               nome_completo: data.nome_completo,
               empresa_representante: data.nome_empresa,
               documento: data.documento,
               placa_veiculo: data.placa_veiculo,
               criado_em: serverTimestamp(),
            },
         );

         Alert.alert("Sucesso!", "Dados salvos no Firebase.");
         reset(); // Limpa os campos após o sucesso
      } catch (e) {
         console.error(e);
         Alert.alert("Erro", "Falha ao cadastrar no banco.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <View>
         <Text style={styles.header}>Mercadinho do João</Text>

            {/* FORMULÁRIO: FORNECEDOR */}
            <View style={styles.card}>
               <Animated.Text style={[styles.title, { color: animatedColor }]}>
                  Fornecedor
               </Animated.Text>
               <CustomInput
                  name="nome_empresa"
                  label="Empresa"
                  control={control}
                  error={errors.nome_empresa?.message}
               />
               <CustomInput
                  name="nome_produto"
                  label="Produto"
                  control={control}
                  error={errors.nome_produto?.message}
               />
               <CustomInput
                  name="num_pedido"
                  label="Nº Pedido"
                  control={control}
                  error={errors.num_pedido?.message}
                  keyboard="numeric"
               />
               <CustomInput
                  name="quantidade_produto"
                  label="Qtd"
                  control={control}
                  error={errors.quantidade_produto?.message}
                  keyboard="numeric"
               />
            </View>

            {/* FORMULÁRIO: ENTREGADOR */}
            <View style={styles.card}>
               <Animated.Text style={[styles.title, { color: animatedColor }]}>
                  Entregador
               </Animated.Text>
               <CustomInput
                  name="nome_completo"
                  label="Nome do Entregador"
                  control={control}
                  error={errors.nome_completo?.message}
               />
               <CustomInput
                  name="placa_veiculo"
                  label="Placa"
                  control={control}
                  error={errors.placa_veiculo?.message}
               />
               <CustomInput
                  name="documento"
                  label="Documento"
                  control={control}
                  error={errors.documento?.message}
               />
            </View>

            <AnimatedTouchableOpacity
               style={[styles.button, { backgroundColor: animatedColor }]}
               onPress={handleSubmit(handleCadastro)}
               disabled={loading}
            >
               {loading ? (
                  <ActivityIndicator color="#fff" />
               ) : (
                  <Text style={styles.buttonText}>CADASTRAR</Text>
               )}
            </AnimatedTouchableOpacity>
      </View>
   );
}

interface CustomInputProps {
   name: keyof FormData;
   label: string;
   control: Control<FormData>;
   error?: string;
   keyboard?: "default" | "numeric";
}

const CustomInput = ({
   name,
   label,
   control,
   error,
   keyboard = "default",
}: CustomInputProps) => (
   <View style={{ marginBottom: 10 }}>
      <Text style={{ fontWeight: "bold", color: "#555" }}>{label}</Text>
      <Controller
         control={control}
         name={name}
         render={({ field: { onChange, value } }) => (
            <TextInput
               style={[styles.input, error ? { borderColor: "red" } : {}]}
               onChangeText={onChange}
               value={value !== undefined ? String(value) : ""}
               keyboardType={keyboard}
            />
         )}
      />
      {error && <Text style={{ color: "red", fontSize: 10 }}>{error}</Text>}
   </View>
);

const styles = StyleSheet.create({
   header: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 20,
      textAlign: "center",
      color: "#333",
   },
   card: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
      elevation: 4,
   },
   title: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#007bff",
      marginBottom: 10,
      borderBottomWidth: 1,
      borderColor: "#eee",
      paddingBottom: 5,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
      marginBottom: 15,
   },
   input: {
      borderBottomWidth: 1,
      borderColor: "#ccc",
      paddingVertical: 5,
      fontSize: 16,
   },
   button: {
      padding: 15,
      borderRadius: 8,
      alignItems: "center",
      marginTop: 10,
      marginBottom: 30,
   },
   buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});