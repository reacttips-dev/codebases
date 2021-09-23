import { postStreamAllFragments } from './fragments'

export const globalPostStreamQuery = `
  ${postStreamAllFragments}
  query($kind: StreamKind!, $before: String) {
    globalPostStream(kind: $kind, before: $before) { ...postStream }
  }
`

export const subscribedPostStreamQuery = `
  ${postStreamAllFragments}
  query($kind: StreamKind!, $before: String) {
    subscribedPostStream(kind: $kind, before: $before) { ...postStream }
  }
`

export const categoryPostStreamQuery = `
  ${postStreamAllFragments}
  query($slug: String!, $kind: StreamKind!, $before: String) {
    categoryPostStream(slug: $slug, kind: $kind, before: $before) { ...postStream }
  }
`

export const followingPostStreamQuery = `
  ${postStreamAllFragments}
  query($kind: StreamKind!, $before: String) {
    followingPostStream(kind: $kind, before: $before) { ...postStream }
  }
`
