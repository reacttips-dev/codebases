function supportsPassive() {
  let supports = false

  try {
    const opts = Object.defineProperty({}, 'passive', {
      get() {
        supports = true
        return false
      },
    })
    // @ts-ignore
    window.addEventListener('testPassive', null, opts)
    // @ts-ignore
    window.removeEventListener('testPassive', null, opts)
  } catch (e) {
    supports = false
  }

  return supports
}

export default supportsPassive
