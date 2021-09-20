export const dev = process.env.NODE_ENV !== 'production'
export const preview = process.env.CONTENTFUL_PREVIEW === 'true'
export const staging = process.env.STAGING === 'true'
export const test = process.env.NODE_ENV === 'test'
export const production = !dev && !preview && !staging
