import {
   collection,
   deleteDoc,
   doc,
   limit,
   query,
   onSnapshot,
   where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
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

export default function ConsultaEntrega() {
   const [loading, setLoading] = useState(false);
   const [searchQuery, setSearchQuery] = useState("");
   const [searchResults, setSearchResults] = useState<any[]>([]);

   const animValue = useRef(new Animated.Value(0)).current;

   useEffect(() => {
      Animated.loop(
         Animated.sequence([
            Animated.timing(animValue, { toValue: 1, duration: 2000, useNativeDriver: false }),
            Animated.timing(animValue, { toValue: 0, duration: 2000, useNativeDriver: false }),
         ]),
      ).start();
   }, [animValue]);

   const animatedColor = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: ["#4B3D5F", "#9146FF"],
   });

   // MELHORIA: Deleção Otimista (Interface limpa instantaneamente)
   const handleDelete = async (id: string) => {
      Alert.alert(
         "Confirmar Exclusão",
         "Tem certeza que deseja apagar este fornecedor?",
         [
            { text: "Cancelar", style: "cancel" },
            {
               text: "Excluir",
               style: "destructive",
               onPress: async () => {
                  // Guardamos o estado antigo caso precise restaurar (Rollback)
                  const backupResultados = [...searchResults];
                  
                  // Atualiza a UI imediatamente para parecer instantâneo
                  setSearchResults(current => current.filter(item => item.id !== id));

                  try {
                     await deleteDoc(doc(db, "fornecedores", id));
                     // Não precisa de Alert de sucesso pesado interrompendo o usuário
                  } catch (e) {
                     console.error(e);
                     // Se der erro, desfaz a alteração na tela e avisa o usuário
                     setSearchResults(backupResultados);
                     Alert.alert("Erro", "Falha ao apagar o registro no servidor.");
                  }
               },
            },
         ],
      );
   };

   // MELHORIA: Efeito dinâmico com Debounce para busca em tempo real sem botão
   useEffect(() => {
      setLoading(true);

      // Aguarda 500ms após o usuário parar de digitar para disparar o Firebase
      const delayDebounceFn = setTimeout(() => {
         let q;

         if (searchQuery.trim()) {
            q = query(
               collection(db, "fornecedores"),
               where("nome_empresa", "==", searchQuery.trim())
            );
         } else {
            // Se vazio, monitora dinamicamente os 10 mais recentes
            q = query(collection(db, "fornecedores"), limit(10));
         }

         const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const results = querySnapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            }));
            setSearchResults(results);
            setLoading(false);
         }, (error) => {
            console.error("Erro no Listener:", error);
            setLoading(false);
         });

         return () => unsubscribe();
      }, 500); // Meio segundo de espera

      return () => clearTimeout(delayDebounceFn);
   }, [searchQuery]);

   return (
      <View style={[styles.card, { marginBottom: 50 }]}>
         <Animated.Text style={[styles.sectionTitle, { color: animatedColor }]}>
            Consultar Banco de Dados
         </Animated.Text>
         
         <View style={styles.searchContainer}>
            <TextInput
               style={styles.searchInput}
               placeholder="Digite o nome da empresa para buscar..."
               value={searchQuery}
               onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
               <TouchableOpacity style={styles.clearButton} onPress={() => setSearchQuery("")}>
                  <Text style={styles.clearButtonText}>X</Text>
               </TouchableOpacity>
            )}
         </View>

         {loading && <ActivityIndicator size="small" color="#9146FF" style={{ marginBottom: 10 }} />}

         <Text style={styles.subTitle}>
            {searchQuery.trim() ? `Resultados para "${searchQuery}":` : "Registros Recentes:"}
         </Text>

         {searchResults.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
         ) : (
            searchResults.map((item) => (
               <View key={item.id} style={styles.resultItem}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                     <Text style={[styles.resultText, { fontWeight: 'bold' }]}>
                        {item.nome_empresa}
                     </Text>
                     <Text style={styles.resultText}>Prod: {item.nome_produto}</Text>
                     <Text style={styles.resultText}>Pedido: {item.num_pedido} | Qtd: {item.quantidade_produto}</Text>
                  </View>
                  <TouchableOpacity 
                     style={styles.deleteButton} 
                     onPress={() => handleDelete(item.id)}
                  >
                     <Text style={styles.deleteButtonText}>Apagar</Text>
                  </TouchableOpacity>
               </View>
            ))
         )}
      </View>
   );
}

// ... Seus styles continuam exatamente iguais

const styles = StyleSheet.create({
   card: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
      elevation: 4,
   },
   sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
   },
   subTitle: {
      fontSize: 14,
      fontWeight: "600",
      color: "#666",
      marginBottom: 10,
      marginTop: 5,
   },
   searchContainer: {
      flexDirection: 'row',
      marginBottom: 15,
      alignItems: 'center',
   },
   searchInput: {
      flex: 1,
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 6,
      paddingHorizontal: 10,
      paddingVertical: 8,
      fontSize: 14,
      backgroundColor: '#f9f9f9',
   },
   searchButton: {
      backgroundColor: '#9146FF',
      paddingVertical: 10,
      paddingHorizontal: 15,
      borderRadius: 6,
      marginLeft: 8,
   },
   searchButtonText: {
      color: '#fff',
      fontWeight: 'bold',
   },
   clearButton: {
      padding: 10,
      marginLeft: 5,
   },
   clearButtonText: {
      color: '#dc3545',
      fontWeight: 'bold',
   },
   resultItem: {
      padding: 12,
      backgroundColor: "#f8f9fa",
      borderRadius: 8,
      marginBottom: 10,
      borderLeftWidth: 4,
      borderLeftColor: "#9146FF",
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
   },
   resultText: { fontSize: 14, color: "#333", marginBottom: 2 },
   emptyText: { textAlign: 'center', color: '#999', marginVertical: 10, fontSize: 14 },
   deleteButton: {
      backgroundColor: '#dc3545',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 6,
   },
   deleteButtonText: { color: '#fff', fontSize: 12, fontWeight: 'bold' }
});