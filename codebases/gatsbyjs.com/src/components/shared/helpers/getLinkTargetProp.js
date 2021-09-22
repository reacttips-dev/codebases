export function isExternalUrl(url) {
  return /^https?:\/\//.test(url)
}

export function getLinkTargetProp(url) {
  const linkProps = {}
  const isExternalLink = isExternalUrl(url)

  if (isExternalLink) {
    linkProps.href = url
  } else {
    linkProps.to = url
  }

  return linkProps
}
