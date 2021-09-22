import React from 'react';
import type { RouterState } from 'react-router';
import type { InjectedRouter } from 'js/lib/connectToRouter';
import type { MatchState } from 'react-router/lib/match';

type History = MatchState['history'];
type Location = MatchState['location'];

export type OldRouterNewContextValue = {
  history?: History;
  location?: Location;
  router?: InjectedRouter;
};

type Params = RouterState['params'];

export const OldRouterNewContext = React.createContext<OldRouterNewContextValue>({});

/**
 * This Hook returns the router object from the React Router context. Sample usage:
 *
 * ```
 * const { push } = useRouter();
 * ```
 *
 * To aid in the transition from the `connectToRouter` HOC, `useRoute` takes an optional callback that is used to map
 * the router to whatever you want the Hook to return, e.g.
 *
 * ```
 * const { discussionPage, itemId } = useRouter((router) => ({
 *   discussionPage: parseInt(router.location.query.page, 10) || 1,
 *   itemId: router.params.itemId,
 * }));
 * ```
 *
 * @param {function} getPropsFromRouter - an _optional_ callback to map the router to the Hook's return value (primarily
 *                                        used for easy of transition from `connectWithRouter` HOC)
 * @return {InjectedRouter} - the router object
 */
export function useRouter<RouterProps = InjectedRouter>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getPropsFromRouter: (router: InjectedRouter) => RouterProps = (r) => r as any
) {
  const { router } = React.useContext(OldRouterNewContext);
  if (!router) {
    throw new Error('useRouter cannot find router; did you forget to add an OldRouterNewContext.Provider?');
  }
  return getPropsFromRouter(router);
}

/**
 * This Hook gives you access to the `history` instance that you may use to navigate.
 * @return {History} - the history instance
 */
export function useHistory(): History {
  const { history } = React.useContext(OldRouterNewContext);
  if (!history) {
    throw new Error('useHistory cannot find history; did you forget to add an OldRouterNewContext.Provider?');
  }
  return history;
}

/**
 * This Hook returns the `location` object that represents the current URL. You can think about it like a `useState`
 * that returns a new location whenever the URL changes.
 * @return {Location} - the location object
 */
export function useLocation(): Location {
  const { location } = React.useContext(OldRouterNewContext);
  if (!location) {
    throw new Error('useLocation cannot find location; did you forget to add an OldRouterNewContext.Provider?');
  }
  return location;
}

/**
 * This Hook returns an object of key/value pairs of URL parameters. Use it to access `match.params` of the current
 * `<Route>`.
 * @return {object} - an object where the key is the URL placeholder name and the value is the URL fragment string
 */
export function useParams(): Params {
  const { router } = React.useContext(OldRouterNewContext);
  if (!router) {
    throw new Error('useParams cannot find router; did you forget to add an OldRouterNewContext.Provider?');
  }
  return router.params;
}

export default useRouter;
