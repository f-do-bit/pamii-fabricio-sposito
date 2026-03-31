import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';

// Definição da interface para as propriedades do botão
interface BotaoProps {
  titulo: string;
  corFundo: string;
  corTexto?: string;
}

export default function Index() {
  // Estados para armazenar a expressão atual e o resultado exibido
  const [expressao, setExpressao] = useState<string>('');
  const [resultado, setResultado] = useState<string>('0');

  // Operadores matemáticos suportados
  const operadores = ['+', '-', 'x', '÷', '.'];

  // Matriz que define a organização dos botões no teclado
  const linhasDeBotoes = [
    ['C', '(', ')', '÷'],
    ['7', '8', '9', 'x'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '⌫', '=']
  ];

  // Função para definir a cor de cada botão logicamente
  const obterCorFundo = (botao: string): string => {
    if (botao === 'C') return '#ff3b30';
    if (botao === '=') return '#34c759';
    if (['+', 'x', '-', '÷'].includes(botao)) return '#ff9500';
    if (['(', ')', '⌫'].includes(botao)) return '#555555';
    return '#333333';
  };

  // Função principal que gerencia os cliques nos botões
  const lidarComToque = (valor: string): void => {
    // Botão de Limpar (Clear)
    if (valor === 'C') {
      setExpressao('');
      setResultado('0');
    } 
    // Botão de Apagar (Backspace)
    else if (valor === '⌫') {
      const novaExpressao = expressao.slice(0, -1);
      setExpressao(novaExpressao);
      setResultado(novaExpressao.length > 0 ? novaExpressao : '0');
    } 
    // Botão de Igual (Calcular)
    else if (valor === '=') {
      try {
        // Substitui os símbolos visuais por operadores que o JS entende
        const expressaoFormatada = expressao.replace(/x/g, '*').replace(/÷/g, '/');
        const resultadoCalculado = eval(expressaoFormatada);

        setResultado(String(resultadoCalculado));
        setExpressao(String(resultadoCalculado));
      } catch (e) {
        setResultado('Erro');
      }
    } 
    // Tratamento de Números e Operadores
    else {
      if (operadores.includes(valor)) {
        // Impede começar com operador (exceto menos para números negativos)
        if (expressao === '' && valor !== '-') return;

        const ultimoCaractere = expressao.slice(-1);

        // Se o último caractere já for um operador, substitui pelo novo
        if (operadores.includes(ultimoCaractere)) {
          const novaExpressao = expressao.slice(0, -1) + valor;
          setExpressao(novaExpressao);
          setResultado(novaExpressao);
          return;
        }
      }
      
      const novaExpressao = expressao + valor;
      setExpressao(novaExpressao);
      setResultado(novaExpressao);
    }
  };

  // Sub-componente interno para renderizar cada botão individualmente
  const Botao: React.FC<BotaoProps> = ({ titulo, corFundo = '#333333', corTexto = '#ffffff' }) => (
    <TouchableOpacity
      style={[styles.botao, { backgroundColor: corFundo }]}
      onPress={() => lidarComToque(titulo)}
    >
      <Text style={[styles.textoBotao, { color: corTexto }]}>{titulo}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Área de exibição do resultado */}
      <View style={styles.displayContainer}>
        <Text style={styles.textoDisplay} numberOfLines={1} adjustsFontSizeToFit>
          {resultado}
        </Text>
      </View>

      {/* Área do teclado numérico */}
      <View style={styles.tecladoContainer}>
        {linhasDeBotoes.map((linha, indexLinha) => (
          <View key={indexLinha} style={styles.linha}>
            {linha.map((botao) => (
              <Botao
                key={botao}
                titulo={botao}
                corFundo={obterCorFundo(botao)}
              />
            ))}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

// Estilização (CSS-in-JS)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  displayContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 20,
  },
  textoDisplay: {
    fontSize: 70,
    color: '#ffffff',
    fontWeight: '300',
  },
  tecladoContainer: {
    paddingBottom: 30,
    paddingHorizontal: 10,
  },
  linha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  botao: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textoBotao: {
    fontSize: 32,
    fontWeight: '400',
  },
});