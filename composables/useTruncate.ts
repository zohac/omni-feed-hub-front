// composables/useTruncate.ts
export const useTruncate = () => {
  const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text
    }
    return text.substring(0, maxLength) + '...'
  }

  return {
    truncateText
  }
}
