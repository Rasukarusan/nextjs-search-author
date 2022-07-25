export const bgColors = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#0C8CC2',
  '#F73E58',
  '#507C8F',
  '#FF8042',
  '#27F5C1',
]

const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max)
}

export const getRandomColor = (): string => {
  const i = getRandomInt(bgColors.length)
  return bgColors[i]
}
