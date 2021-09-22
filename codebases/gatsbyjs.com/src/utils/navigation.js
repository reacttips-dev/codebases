/**
 * Returns a URL path fragment if the provided node exists.
 * @param  {Object?} node   info about a node including a slug property
 * @return {String}         the path for the given node
 */
export const getPath = node =>
  node ? `${node.slug}/`.replace(/\/\/$/g, `/`) : ``

/**
 * Returns the path for a given page node, including its parent.
 * @param  {Object} node    info about a node
 * @return {String}         the full path of the given node
 */
export const getLink = node => `/${getPath(node.parentPage)}${getPath(node)}`

const byWeight = (a, b) => a.weight - b.weight

/**
 * Converts a flat array of page nodes into a nested array for use with the nav.
 * @param  {Array} navItems page nodes to be displayed in the nav
 * @return {Array}          nested page nodes for use in the nav
 */
export const getNavItems = navItems =>
  navItems
    .reduce((nav, { node }, _, allNodes) => {
      // TODO: fix with https://github.com/gatsby-inc/mansion/issues/5273
      const navItem =
        node.slug === `contact-us`
          ? {
              name: `Log in`,
              slug: `dashboard`,
              weight: node.weight,
            }
          : node

      // If there’s no parent page, this is a top-level node.
      if (!node.parentPage) {
        return !nav.find(n => n.slug === node.slug) ? nav.concat(navItem) : nav
      }

      // Get the parent page slug.
      const parentSlug = node.parentPage.slug

      // Find the parent node.
      const bySlug = p => p.slug === parentSlug
      const parent =
        nav.find(bySlug) || allNodes.find(({ node }) => bySlug(node)).node

      return (
        nav
          // Create a new array, but remove the original parent node.
          .filter(p => p.slug !== parentSlug)
          // Add the node to the parent node and add it to the new array.
          .concat({
            ...parent,
            sections: [...(parent.sections || []), node]
              .filter(Boolean)
              .sort(byWeight),
          })
      )
    }, [])
    .sort(byWeight)
