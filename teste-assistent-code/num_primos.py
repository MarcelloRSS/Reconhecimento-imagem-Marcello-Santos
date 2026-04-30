def is_prime(n: int) -> bool:
    """
    Verifica se um número é primo.

    Um número primo é um inteiro positivo maior que 1 que possui apenas
    dois divisores positivos distintos: 1 e ele mesmo.

    Args:
        n (int): O número inteiro a ser verificado.

    Returns:
        bool: True se o número for primo, False caso contrário.

    Raises:
        TypeError: Se n não for um inteiro.
    """
    if not isinstance(n, int):
        raise TypeError("O argumento deve ser um inteiro.")

    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False

    # Verifica divisores da forma 6k ± 1 até a raiz quadrada de n
    divisor = 5
    while divisor * divisor <= n:
        if n % divisor == 0 or n % (divisor + 2) == 0:
            return False
        divisor += 6

    return True


# Exemplo de uso e testes
if __name__ == "__main__":
    # Testes básicos
    test_cases = [
        (1, False),
        (2, True),
        (3, True),
        (4, False),
        (17, True),
        (18, False),
        (23, True),
        (25, False),
    ]

    for num, expected in test_cases:
        result = is_prime(num)
        status = "PASS" if result == expected else "FAIL"
        print(f"is_prime({num}) = {result} ({status})")