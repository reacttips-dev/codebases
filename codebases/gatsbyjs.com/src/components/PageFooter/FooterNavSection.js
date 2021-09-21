import React from "react"
import { useTheme } from "gatsby-interface"

import { useMatchMedia } from "../shared/hooks"
import { FooterNavSectionHeading } from "./FooterNavSectionHeading"
import { FooterNavSectionItems } from "./FooterNavSectionItems"

const rootCss = theme => ({
  margin: 0,
  borderBottom: `1px  solid ${theme.colors.grey[20]}`,

  [theme.mediaQueries.tablet]: {
    borderBottom: 0,
  },
})

export function FooterNavSection({ heading, items, isInverted }) {
  const { mediaQueries } = useTheme()
  const isMobile = !useMatchMedia(mediaQueries.tablet)
  const [isExpanded, setIsExpanded] = React.useState(!isMobile)

  React.useEffect(() => {
    setIsExpanded(!isMobile)
  }, [isMobile])

  return (
    <li css={rootCss}>
      <FooterNavSectionHeading
        heading={heading}
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        isMobile={isMobile}
        isInverted={isInverted}
      />
      <FooterNavSectionItems
        data={items}
        isExpanded={isExpanded}
        isInverted={isInverted}
      />
    </li>
  )
}
