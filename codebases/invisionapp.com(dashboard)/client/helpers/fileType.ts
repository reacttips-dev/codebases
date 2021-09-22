function check(header: Iterable<number>, bytes: number[]) {
  const array = new Uint8Array(header)

  for (let i = 0; i < bytes.length; i++) {
    if (array[i] !== bytes[i]) {
      return false
    }
  }

  return true
}

function fileType(file: Iterable<number>) {
  // inspiration from https://github.com/sindresorhus/file-type
  if (check(file, [0xff, 0xd8, 0xff])) {
    return {
      ext: 'jpg',
      mime: 'image/jpeg'
    }
  }

  if (check(file, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) {
    return {
      ext: 'png',
      mime: 'image/png'
    }
  }

  if (check(file, [0x47, 0x49, 0x46])) {
    return {
      ext: 'gif',
      mime: 'image/gif'
    }
  }

  return { ext: '', mime: '' }
}

export default fileType
