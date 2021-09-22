import Typography from "typography"
import CodePlugin from "typography-plugin-code"
import { getTheme } from "gatsby-interface"

const { fonts, colors, lineHeights } = getTheme()

function fontFamilyStringToArray(fontFamily) {
  return fontFamily.split(`,`).map(font => font.trim())
}

const settings = {
  headerFontFamily: fontFamilyStringToArray(fonts.heading),
  bodyFontFamily: fontFamilyStringToArray(fonts.body),
  monospaceFontFamily: fontFamilyStringToArray(fonts.monospace),
  headerColor: colors.black,
  bodyColor: colors.blackFade[80],
  scaleRatio: 2,
  baseLineHeight: lineHeights.default,
  headerLineHeight: lineHeights.dense,
  plugins: [new CodePlugin()],
  overrideStyles: (_, options) => {
    return {
      html: {
        overflowY: `auto`,
      },
      body: {
        overflow: `hidden`,
      },
      a: {
        color: colors.gatsby,
      },
      "h1 tt, h1 code, h2 tt, h2 code, h3 tt, h3 code, h4 tt, h4 code, h5 tt, h5 code, h6 tt, h6 code, strong tt, strong code": {
        fontWeight: `normal`,
      },
      "svg text": {
        fontFamily: `${options.bodyFontFamily.join(`,`)} !important`,
      },
    }
  },
}

const typography = new Typography(settings)

export const { rhythm } = typography
export const { options } = typography
export const { scale } = typography

export default typography
