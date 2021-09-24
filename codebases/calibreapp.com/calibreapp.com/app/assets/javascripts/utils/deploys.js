export const formatDeployMarkers = deploys =>
  (deploys.edges || []).map(edge => {
    const {
      node: { createdAt, revision, repository, username, url }
    } = edge

    return {
      name: `Deploy ${revision ? revision : ``}`,
      byline: username ? ` by ${username}` : ``,
      url: url || repository,
      timestamp: createdAt
    }
  })
