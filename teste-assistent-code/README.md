# Teste Assistente Code

Este projeto contém exemplos de código Python para demonstrar conceitos fundamentais de programação, incluindo verificação de números primos, técnicas de debug e refatoração de código. É um conjunto de arquivos educacionais para aprendizado prático.

## Descrição

O projeto é dividido em três módulos principais:

1. **Verificação de Números Primos** (`num_primos.py`): Implementa uma função otimizada para verificar se um número é primo, com testes incluídos.
2. **Debug de Código** (`debug.py`): Exemplo de um programa corrigido para calcular um recibo de compras, com comentários explicativos das decisões lógicas, demonstrando correções de erros comuns.
3. **Refatoração de Código** (`refatoracao.py`): Versão refatorada de uma função para calcular estatísticas de uma lista, mostrando melhorias em eficiência e legibilidade.

Cada módulo inclui explicações detalhadas em arquivos Markdown correspondentes.

## Estrutura do Projeto

```
teste-assistent-code/
├── num_primos.py              # Função para verificar números primos
├── explicacao_num_primo.md    # Explicação técnica da função de primos
├── debug.py                   # Programa corrigido para cálculo de recibo
├── explicacao-debug.md        # Análise dos erros originais e correções
├── refatoracao.py             # Função refatorada para estatísticas
├── explicacao-refatoracao.md  # Explicação da refatoração
└── README.md                  # Este arquivo
```

## Pré-requisitos

- Python 3.6 ou superior
- Nenhum pacote adicional é necessário (usa apenas bibliotecas padrão do Python)

## Como Usar

### Verificação de Números Primos

Execute o arquivo `num_primos.py` para rodar os testes:

```bash
python num_primos.py
```

A função `is_prime(n)` pode ser importada e usada em outros códigos:

```python
from num_primos import is_prime

print(is_prime(17))  # True
print(is_prime(18))  # False
```

### Programa de Debug

Execute o arquivo `debug.py` para simular um cálculo de recibo:

```bash
python debug.py
```

O programa solicitará entradas interativas para nome do cliente, quantidades e preços dos itens, e percentual de desconto.

### Refatoração de Código

Execute o arquivo `refatoracao.py` para calcular estatísticas de uma lista de exemplo:

```bash
python refatoracao.py
```

A função `calculate_statistics(numbers)` pode ser usada com qualquer iterável de números:

```python
from refatoracao import calculate_statistics

data = [1, 2, 3, 4, 5]
total, average, maximum, minimum = calculate_statistics(data)
print(f"Total: {total}, Média: {average:.2f}, Máx: {maximum}, Mín: {minimum}")
```

## Exemplos de Saída

### num_primos.py
```
is_prime(1) = False (PASS)
is_prime(2) = True (PASS)
is_prime(3) = True (PASS)
is_prime(4) = False (PASS)
...
```

### debug.py
```
===============================
 Cliente: João Silva
===============================
 Item 1:        R$ 50.00
 Item 2:        R$ 30.00
 Item 3:        R$ 20.00
-------------------------------
 Subtotal:      R$ 100.00
 Imposto (10%): R$ 10.00
===============================
 TOTAL:         R$ 110.00
===============================
```

### refatoracao.py
```
total: 354
media: 35.4
maior: 89
menor: 2
```

## Algoritmos e Conceitos Demonstrados

- **Números Primos**: Algoritmo otimizado com complexidade O(√n)
- **Debug**: Correção de erros de sintaxe, formatação de strings e conversão de tipos
- **Refatoração**: Uso de funções built-in (sum, max, min) para código mais eficiente e legível

## Contribuição

Este é um projeto educacional. Sinta-se à vontade para:

- Adicionar mais exemplos
- Melhorar as explicações
- Corrigir bugs ou otimizar códigos

## Licença

Este projeto é distribuído sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.