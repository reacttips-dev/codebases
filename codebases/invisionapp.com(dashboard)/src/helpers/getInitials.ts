const getInitials = (n?: string): string => {
  let initials = ''
  const name: string = n || ''
  const match = name.match(/([^@]*)/g)
  let first = ''
  let last = ''
  if (!match) {
    return ''
  }

  if (name && `${name}`.match(/^[0-9]+$/)) {
    // all numbers; return as-is for an overflow avatar
    return name
  }

  const str = match[0].replace(/[^0-9a-z\s.]/gi, '')
  const split = str.includes('.') ? str.split('.') : str.split(' ')
  ;[first] = split
  if (split.length === 1) {
    if (first.length === 1) {
      initials = first
    } else {
      initials = `${first.charAt(0)}${first.charAt(1)}`
    }
  } else {
    last = split[split.length - 1]
    initials = `${first.charAt(0)}${last.charAt(0)}`
  }

  return initials.toUpperCase()
}

export default getInitials
