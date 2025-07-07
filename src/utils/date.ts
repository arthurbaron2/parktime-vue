export const getDiffInMinutes = (start?: Date, end?: Date): number => {
  if (!start || !end) return -1

  const diffInMs = end.getTime() - start.getTime()
  return Math.floor(diffInMs / (1000 * 60))
}
