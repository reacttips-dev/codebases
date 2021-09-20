export function loadImage(url: string) {
  return new Promise((resolve) => {
    const img = new window.Image()
    img.crossOrigin = 'Anonymous'
    img.addEventListener('load', resolve, false)
    img.addEventListener('error', resolve, false)
    img.src = url
  })
}
