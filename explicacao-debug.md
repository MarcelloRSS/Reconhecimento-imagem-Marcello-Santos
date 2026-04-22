# Explicação dos Erros em debug.py

## Erros Identificados

1. `float(input(Preço do item 1? ))`
   - Falta de aspas na string da função `input()`.
   - Isso gera um erro de sintaxe porque o texto não está entre aspas.

2. `print(" Item 2:        R$ {total_item2:.2f}")`
   - A string usa chaves para formatação, mas não é um f-string.
   - O valor de `total_item2` não será interpolado, e o texto exibido ficará literal.

3. `desconto_cupom = (input("Você tem um cupom de desconto? (Digite o percentual ou 0): "))`
   - O valor retornado por `input()` é uma string.
   - Em `desconto = subtotal * (desconto_cupom / 100)` ocorre erro de tipo (`TypeError`) porque não é possível dividir string por inteiro.

4. `if desconto_cupom > 0:`
   - Novamente, `desconto_cupom` é string, então a comparação com inteiro causará erro ou comportamento incorreto.

5. Indentação da linha dentro do `if`:
   - `print(f" Desconto ({desconto_cupom:.0f}%): -R$ {desconto:.2f}")` não está indentado dentro do bloco `if`.
   - Isso causa `IndentationError` em Python.

## Conclusão

O código apresentava erros de sintaxe, formatação de strings e conversão de tipos. A correção envolve:

- garantir que as mensagens de `input()` estejam entre aspas;
- usar `f"..."` ao interpolar variáveis em strings;
- converter o valor do cupom para `float` antes de realizar cálculos e comparações;
- corrigir a indentação do bloco `if`.
