import { tshirtImageVersions, imageVersionProps } from './fragments'

export default `
  ${imageVersionProps}
  ${tshirtImageVersions}
  {
    categoryNav {
      id
      name
      slug
      level
      tileImage { ...tshirtImageVersions }
    }
  }
`
