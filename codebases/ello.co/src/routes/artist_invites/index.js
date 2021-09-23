import ArtistInvitesPage from '../../pages/ArtistInvitesPage'
import ArtistInvitesDetailPage from '../../pages/ArtistInvitesDetailPage'

export default [
  {
    path: 'creative-briefs',
    getComponents(location, cb) {
      cb(null, ArtistInvitesPage)
    },
  },
  {
    path: 'creative-briefs/:slug',
    getComponents(location, cb) {
      cb(null, ArtistInvitesDetailPage)
    },
  },
  {
    path: 'invites',
    onEnter(nextState, replace) {
      replace({ pathname: '/creative-briefs', state: nextState })
    },
  },
  {
    path: 'invites/:slug',
    onEnter(nextState, replace) {
      const slug = nextState.params.slug
      replace({ pathname: `/creative-briefs/${slug}`, state: nextState })
    },
  },
  {
    path: 'artist-invites',
    onEnter(nextState, replace) {
      replace({ pathname: '/creative-briefs', state: nextState })
    },
  },
  {
    path: 'artist-invites/:slug',
    onEnter(nextState, replace) {
      const slug = nextState.params.slug
      replace({ pathname: `/creative-briefs/${slug}`, state: nextState })
    },
  },
]

