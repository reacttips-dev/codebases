import { ContentfulImageApiAliasProps } from './index'

const objectToQueryString = (props: any): string => {
  const propKeys = Object.keys(props)
  if (propKeys.length === 0) {
    return ''
  }
  const queryString = propKeys
    .map((propName) => {
      const propValue = props[propName]
      return `${propName}=${propValue}`
    })
    .join('&')
  return `?${queryString}`
}

const removeUndefinedProps = (contentfulProps: any) => {
  const propsToRemove = ['w', 'h', 'fit', 'f', 'r', 'q', 'bg', 'fm', 'fl']
  propsToRemove.forEach((propToRemove) => {
    if (!contentfulProps[propToRemove]) {
      delete contentfulProps[propToRemove]
    }
  })
}

const renameAliasToContentfulKeys = ({
  width,
  height,
  transform,
  focus,
  borderRadius,
  quality,
  backgroundRgbColor,
  format,
  formatOptimization,
}: ContentfulImageApiAliasProps) =>
  ({
    w: width,
    h: height,
    fit: transform,
    f: focus,
    r: borderRadius,
    q: quality,
    bg: backgroundRgbColor,
    fm: format,
    fl: formatOptimization,
  } as any)

/**
 * All props from [Contentful Image API](https://www.contentful.com/developers/docs/references/images-api/) can be used here.
 */
export const transformImagePropsIntoQueryString = (
  contentfulProps: ContentfulImageApiAliasProps,
): string => {
  const mixedProps = renameAliasToContentfulKeys(contentfulProps)
  removeUndefinedProps(mixedProps)
  return objectToQueryString(mixedProps)
}
