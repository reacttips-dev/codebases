import * as React from "react"
import { LinkButtonProps, LinkButton, ThemeCss } from "gatsby-interface"

import { ColorSchemeCss } from "../color-schemes"

const ctasCss: ThemeCss = theme => ({
  display: "flex",
  justifyContent: "center",
  flexDirection: "column",

  [theme.mediaQueries.phablet]: {
    flexDirection: "row",
  },
})

const primaryButtonCss: ColorSchemeCss = theme => ({
  background: theme.colorScheme.dark,
  borderColor: theme.colorScheme.dark,
  borderRadius: theme.radii[3],
  alignSelf: "center",
  marginTop: "auto",

  "&:hover": {
    background: theme.colorScheme.hover,
  },
})

const secondaryButtonCss: ColorSchemeCss = theme => [
  primaryButtonCss(theme),
  {
    background: "transparent",
    border: 0,
    color: theme.colorScheme.dark,
    marginTop: theme.space[6],

    "&:hover": {
      background: theme.colorScheme.light,
      border: 0,
    },

    [theme.mediaQueries.phablet]: {
      marginLeft: theme.space[6],
      marginTop: 0,
    },
  },
]

const buttonCssByVariant = {
  PRIMARY: primaryButtonCss,
  SECONDARY: secondaryButtonCss,
}

const getJustifyContent = (alignment: string) => {
  switch (alignment) {
    case "left":
      return "flex-start"
    case "right":
      return "flex-end"
    default:
      return "center"
  }
}

export interface CtaProps {
  primaryCta?: Ctas
  secondaryCta?: Ctas
  alignment?: "left" | "right" | "center"
}

export interface Ctas {
  title: string
  variant?: LinkButtonProps["variant"]
  to: string
  rightIcon?: LinkButtonProps["rightIcon"]
  leftIcon?: LinkButtonProps["leftIcon"]
}

export function Buttons({
  primaryCta,
  secondaryCta,
  alignment = "center",
}: CtaProps) {
  return primaryCta?.title ? (
    <div
      css={theme => [
        ctasCss(theme),
        { justifyContent: getJustifyContent(alignment) },
      ]}
    >
      {[primaryCta, secondaryCta].map((cta, index) => {
        const variant = index === 0 ? "PRIMARY" : "SECONDARY"
        return cta?.title ? (
          <LinkButton
            key={`twocolumnhero-${index}-${cta?.title}`}
            to={cta?.to ?? ""}
            rightIcon={cta?.rightIcon}
            css={buttonCssByVariant[variant]}
            size="XL"
          >
            {cta.title}
          </LinkButton>
        ) : null
      })}
    </div>
  ) : null
}
