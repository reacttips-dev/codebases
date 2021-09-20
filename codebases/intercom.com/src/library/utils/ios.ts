export const isIosSafari = () => {
  const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : ''
  const iOS = !!userAgent.match(/iP(ad|hone)/i)
  const webkit = !!userAgent.match(/WebKit/i)

  return iOS && webkit && !userAgent.match(/CriOS/i)
}
