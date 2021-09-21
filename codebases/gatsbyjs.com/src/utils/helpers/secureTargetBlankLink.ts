export default function secureTargetBlankLink({
  rel = ``,
  target,
}: {
  rel?: string
  target?: string
}) {
  const NOOPENER_NOREFERRER = `noopener noreferrer`

  if (
    target &&
    target.includes(`_blank`) &&
    !rel.includes(NOOPENER_NOREFERRER)
  ) {
    return `${rel}${rel ? ` ` : ``}${NOOPENER_NOREFERRER}`
  }

  return rel
}
