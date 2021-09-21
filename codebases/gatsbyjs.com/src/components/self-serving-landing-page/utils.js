export const getHtml = contentNode => contentNode?.childMarkdownRemark?.html
export const getImage = imgNode => imgNode?.file?.url
export const getCtas = content => {
  const { ctas } = content

  return {
    primaryCta: {
      title: ctas?.[0]?.anchorText,
      to: ctas?.[0]?.href,
    },
    secondaryCta: {
      title: ctas?.[1]?.anchorText,
      to: ctas?.[1]?.href,
    },
  }
}
