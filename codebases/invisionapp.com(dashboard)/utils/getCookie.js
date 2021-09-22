export default function getCookie (key) {
  key = key.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')

  const regex = new RegExp('(?:^|;)\\s?' + key + '=(.*?)(?:;|$)', 'i')
  const match = document.cookie.match(regex)

  return match && unescape(match[1])
}
