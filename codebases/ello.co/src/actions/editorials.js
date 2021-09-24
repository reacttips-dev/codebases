import { V3 } from '../constants/action_types'
import { editorials as editorialRenderable } from '../components/streams/StreamRenderables'
import { editorialStreamQuery } from '../queries/editorialStreamQueries'
import { findPostsQuery } from '../queries/findPosts'

export const loadEditorials = (isPreview, before) => (
  {
    type: V3.LOAD_STREAM,
    payload: {
      query: editorialStreamQuery,
      variables: { preview: isPreview, before },
    },
    meta: {
      renderStream: {
        asList: editorialRenderable,
        asGrid: editorialRenderable,
      },
    },
  }
)

export const loadPostStream = ({ variables, resultKey, ...props }) =>
  ({
    type: V3.POST.LOAD_MANY,
    payload: { query: findPostsQuery, variables },
    meta: {
      renderProps: { ...props },
      resultKey,
    },
  })

