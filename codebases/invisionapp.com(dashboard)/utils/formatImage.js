export const formatImage = (url, size = 40) => {
  if (!url || url === '') {
    return url
  }

  const normalizedUrl = url.toLowerCase()
  // Do not scale already scaled images
  if (normalizedUrl.includes('width=') || normalizedUrl.includes('height=')) {
    return url
  }

  return `${url}?width=${size}&height=${size}&dpr=${window.devicePixelRatio || 1}&fit=crop&auto=webp`
}
