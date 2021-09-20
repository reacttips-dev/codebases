import { createClient } from 'contentful'

require('../../dotenv-muster').config()

const accessToken: string | undefined = process.env.CONTENTFUL_PREVIEW
  ? process.env.CONTENTFUL_PREVIEW_API_ACCESS_TOKEN
  : process.env.CONTENTFUL_DELIVERY_API_ACCESS_TOKEN

const host: string | undefined = process.env.CONTENTFUL_PREVIEW
  ? 'preview.contentful.com'
  : undefined

if (!accessToken) {
  throw new Error(
    'Must set CONTENTFUL_PREVIEW_API_ACCESS_TOKEN or CONTENTFUL_DELIVERY_API_ACCESS_TOKEN in .env or environment variables',
  )
}

if (!process.env.CONTENTFUL_ENVIRONMENT) {
  console.warn(`You have no Contentful enviroment set. Falling back to the \`master\` environment.`)
}

export default createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
  host,
  accessToken,
})
