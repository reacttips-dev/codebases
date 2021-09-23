import AppContainer from '../containers/AppContainer'
import PostDetailRoute from './post_detail'
import WTFRoute from './wtf'
import ArtistInvitesRoutes from './artist_invites'
import authenticationRoutes from './authentication'
import EditorialRoute, { getComponents as getEditorialComponents } from './editorial'
import {
  discover as discoverRoute,
  discoverAll as discoverAllRoute,
} from './discover'
import SearchRoutes from './search'
import StreamsRoutes from './streams'
import NotificationsRoute from './notifications'
import InvitationsRoutes from './invitations'
import SettingsRoutes from './settings'
import OnboardingRoutes from './onboarding'
import UserDetailRoute from './user_detail'

function createRedirect(from, to) {
  return {
    path: from,
    onEnter(nextState, replace) {
      replace({ pathname: to, state: nextState })
    },
  }
}

const routes = (store) => {
  // Wrap up authenticated routes
  const authenticate = (route) => {
    const oldOnEnter = route.onEnter
    if (typeof oldOnEnter === 'undefined') {
      return {
        ...route,
        onEnter(nextState, replace) {
          const isLoggedIn = store.getState().authentication.get('isLoggedIn')
          if (!isLoggedIn) {
            replace({ pathname: '/enter', state: nextState })
          }
        },
      }
    }

    return {
      ...route,
      onEnter(nextState, replace) {
        const isLoggedIn = store.getState().authentication.get('isLoggedIn')
        if (!isLoggedIn) {
          replace({ pathname: '/enter', state: nextState })
        } else {
          oldOnEnter(nextState, replace)
        }
      },
    }
  }

  const indexRoute = {
    getComponent: getEditorialComponents,
  }

  return [
    {
      path: '/',
      component: AppContainer,
      indexRoute,
      // order matters, so less specific routes should go at the bottom
      childRoutes: [
        WTFRoute,
        ...ArtistInvitesRoutes,
        EditorialRoute,
        PostDetailRoute,
        ...authenticationRoutes(store),
        discoverAllRoute(store),
        discoverRoute(store),
        createRedirect('starred', '/following'),
        ...StreamsRoutes.map(route => authenticate(route)),
        authenticate(NotificationsRoute),
        ...InvitationsRoutes.map(route => authenticate(route)),
        ...SettingsRoutes.map(route => authenticate(route)),
        createRedirect('onboarding', '/onboarding/creator-type'),
        ...OnboardingRoutes(store).map(route => authenticate(route)),
        ...SearchRoutes,
        UserDetailRoute,
      ].filter(value => value !== null),
    },
  ]
}

export default routes

