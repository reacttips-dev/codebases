/* eslint-disable no-unused-vars, no-console */

export const containerMaxWidth = '1290px'

export const gridGap = {
  mobile: '8px',
  tablet: '16px',
  desktop: '24px ',
}

export const companyLogoMaxHeight = '28px'
export const companyLogoMaxWidth = '125px'

export const iconWidth = 60

export enum MarginSizeOption {
  xs = 'xs',
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  xxl = 'xxl',
}

// Used in the LogoParty interpreter.
// Can be used to match a string to its counterpart member
// of the HeadingStyle enum.
export function getTypedHeadingStyle(headingStyleString: string): HeadingStyle {
  // @ts-ignore
  if (typeof HeadingStyle[headingStyleString] === 'undefined') {
    console.warn(`"${headingStyleString}" is not a valid Heading Style`)
    return HeadingStyle.Large
  }

  // @ts-ignore
  return HeadingStyle[headingStyleString]
}

export enum HeadingStyle {
  Large,
  Small,
  Tiny,
  Hidden,
}
