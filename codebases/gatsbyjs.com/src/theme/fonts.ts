import { FontToken } from "gatsby-design-tokens"
import { fonts as baseFonts } from "gatsby-design-tokens"

export type Font = FontToken | "headingUI"

const fonts: Record<Font, string> = {
  ...baseFonts,
  headingUI:
    "Inter,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
}

export default fonts

/*

  fonts = {
    heading: "Futura PT,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
    monospace: "SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace",
    serif: "Georgia,Times New Roman,Times,serif",
    body: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
    system: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
  }

*/
