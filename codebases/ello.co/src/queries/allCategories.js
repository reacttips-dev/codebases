import { authorSummary, tshirtImageVersions, imageVersionProps } from './fragments'

export default `
  ${authorSummary}
  ${imageVersionProps}
  ${tshirtImageVersions}
  {
    allCategories {
      id
      name
      slug
      level
      order
      allowInOnboarding
      isCreatorType
      brandAccount { ...authorSummary }
      tileImage { ...tshirtImageVersions }
    }
  }
`
