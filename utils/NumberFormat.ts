export const NumberFormat = (x: number) => {
  const rounded = Math.round(x)
  return rounded
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}