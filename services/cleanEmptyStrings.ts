// services/cleanEmptyStrings.ts

// Nettoyage des champs optionnels
export function cleanEmptyStrings<T>(dto: T): Partial<T> {
  const cleaned: Partial<T> = {}

  for (const key in dto) {
    const value = dto[key as keyof T]

    // Si la valeur n'est pas une chaîne vide, on l'ajoute
    if (value !== '') {
      cleaned[key as keyof T] = value
    }
  }
  return cleaned
}
