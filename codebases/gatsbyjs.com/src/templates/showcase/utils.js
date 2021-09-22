/*
Normalizes featured site data for a FeaturedSitesGrid, based on whether the data comes from Self Service Landing Pages in Contentful, or from Showcase Sites in Wordpress
*/
export const normalizeFeaturedSiteData = node => {
  const featuredSite = {}

  if (node.contentful_id !== undefined) {
    featuredSite.title = node.primaryText
    featuredSite.url = node.ctas[0].href
    featuredSite.image = node.images[0].gatsbyImageData
    featuredSite.id = node.contentful_id
  } else {
    featuredSite.title = node.showcaseSiteFields.title
    featuredSite.url = node.showcaseSiteFields.mainUrl
    featuredSite.image =
      node.showcaseSiteFields.screenshot.localFile.childImageSharp.gatsbyImageData
    featuredSite.builtBy = node.showcaseSiteFields.builtBy
    featuredSite.catagories = node.catagories
    featuredSite.id = node.id
  }

  return featuredSite
}
