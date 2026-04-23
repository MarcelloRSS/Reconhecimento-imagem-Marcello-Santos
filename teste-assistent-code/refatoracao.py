from typing import Iterable, Tuple


def calculate_statistics(numbers: Iterable[int]) -> Tuple[int, float, int, int]:
    """Calcula total, média, maior e menor valor de uma sequência de inteiros.

    Args:
        numbers: Sequência de inteiros.

    Returns:
        Uma tupla com total, média, maior e menor valores.

    Raises:
        ValueError: Se a sequência estiver vazia.
    """
    values = list(numbers)
    if not values:
        raise ValueError("A lista de números não pode ser vazia.")

    total = sum(values)
    average = total / len(values)
    maximum = max(values)
    minimum = min(values)

    return total, average, maximum, minimum


def main() -> None:
    sample_values = [23, 7, 45, 2, 67, 12, 89, 34, 56, 11]
    total, average, maximum, minimum = calculate_statistics(sample_values)

    print("total:", total)
    print("media:", average)
    print("maior:", maximum)
    print("menor:", minimum)


if __name__ == "__main__":
    main()
