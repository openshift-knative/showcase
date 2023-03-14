export const uuid = (): string => {
  return URL.createObjectURL(new Blob([])).slice(-36)
}
