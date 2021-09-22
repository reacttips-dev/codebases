export const generateCsvFile = (csv: string, filename: string) => {
  const a = document.createElement('a')
  a.href = `data:text/csv;charset=utf-8, ${encodeURI(csv)}`
  a.target = '_blank'
  a.download = filename
  a.click()
}
