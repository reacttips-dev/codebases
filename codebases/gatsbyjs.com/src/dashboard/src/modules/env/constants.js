export const fullStoryEnabled = process.env.GATSBY_FULLSTORY_ORG

export const buildsGAEnabled = process.env.GATSBY_BUILDS_GA === `true`

export const isProduction = process.env.NODE_ENV === `production`
