import * as React from "react"
import * as sanitizeHTML from "sanitize-html"
import { Heading, Spacer, ThemeCss, Text, useTheme } from "gatsby-interface"
import {
  textLinearGradient,
  sectionCss,
  sectionTitleCss,
  eyebrowHeadingCss,
  maxSectionWidth,
} from "../style-utils"
import { getHtml } from "../utils"
import { ColorSchemeCss } from "../color-schemes"
import MarketingForm from "../../marketing-forms/MarketingForm"

const Arrow = (props: React.SVGAttributes<SVGElement>): JSX.Element => (
  <svg width="25" height="115" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path stroke="#fff" d="M12.5 96.094v-96" />
    <path
      d="M23.5 91.151l-11.198 21.847L1.104 91.151l10.989 5.045.209.096.208-.096L23.5 91.15z"
      fill="#fff"
      stroke="#fff"
    />
  </svg>
)

const eyebrowCss: ColorSchemeCss = theme => [
  eyebrowHeadingCss(theme),
  {
    marginBottom: 0,
    textAlign: "center",
  },
]

const containerCss: ColorSchemeCss = theme => ({
  alignItems: `center`,
  background: theme.colorScheme.light,
  display: `flex`,
  flexDirection: `column`,
  padding: `0 ${theme.space[7]} ${theme.space[13]} `,
  textAlign: `center`,
  position: `relative`,
  zIndex: 0,

  [theme.mediaQueries.desktop]: {
    paddingBottom: theme.space[15],
    borderRadius: theme.radii[4],
  },
})

const subtitleCss: ThemeCss = theme => ({
  color: theme.colors.dark,
  fontSize: theme.fontSizes[3],
  marginTop: theme.space[4],
  maxWidth: maxSectionWidth.default,
  textAlign: `center`,
})

const headingCss: ColorSchemeCss = theme => [
  sectionTitleCss(theme),
  textLinearGradient({
    direction: 180,
    startColor: theme.colorScheme.gradient.start,
    endColor: theme.colorScheme.gradient.stop,
  }),
  {
    color: theme.colorScheme.dark,
  },
]

interface MarketoFormCampaignObject {
  formId: string
  name: string
}

interface MarketoThankYouMessage {
  childMarkdownRemark: {
    html: string
  }
}

interface MarketoFormData {
  id: string
  marketoFormCampaignObject: MarketoFormCampaignObject
  thankYouMessage: MarketoThankYouMessage
}

interface ContactFormProps {
  eyebrow: string
  heading: string
  lede: string
  form: MarketoFormData
}

export function ContactForm({
  eyebrow,
  heading,
  lede,
  form,
}: ContactFormProps): JSX.Element {
  const theme = useTheme()
  return (
    <section id="contact" css={sectionCss}>
      <div css={containerCss}>
        <Arrow />
        {eyebrow ? <Text css={eyebrowCss}>{eyebrow}</Text> : null}
        {heading ? (
          <React.Fragment>
            <Heading as="h2" css={headingCss} variant="EMPHASIZED">
              {heading}
            </Heading>
          </React.Fragment>
        ) : null}
        {lede ? (
          <React.Fragment>
            <Text
              as="div"
              css={subtitleCss}
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(lede) }}
            ></Text>
            <Spacer size={12} />
          </React.Fragment>
        ) : null}
        {form ? (
          <MarketingForm
            wrapperCss={{
              alignItems: `center`,

              form: {
                fontFamily: theme.fonts.body,
              },

              "& label": {
                color: theme.colors.blackFade[70],
              },
            }}
            form={form}
          />
        ) : null}
      </div>
    </section>
  )
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mapContactFormProps = (entry: any): ContactFormProps => {
  // Pull the Content and Appearance blocks out of the Section block that is passed in
  const { content } = entry

  // Normalize the data
  // TODO: fallback and report error if formData is not provided
  const contactFormContent = content || {}
  // Return the props that will be passed into ContactForm
  return {
    heading: contactFormContent?.primaryText,
    eyebrow: contactFormContent?.secondaryText,
    lede: getHtml(contactFormContent?.description),
    form: contactFormContent?.form,
  }
}
