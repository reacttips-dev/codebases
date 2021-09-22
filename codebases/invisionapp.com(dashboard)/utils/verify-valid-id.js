const regex = /^c[^\s-]{8,}$/

export default function verifyValidId (id) {
  return regex.test(id + '')
}
