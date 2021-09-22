/* tslint:disable:forbid-import */
// Effectively we're treating the address bar as a UI element here; however,
// there's no way to put @observer on the address bar, so we need to use
// autorun() to observe and react to the state change.
import { autorun, computed } from 'mobx';
/* tslint:enable:forbid-import */
import navigateToRoute from './navigateToRoute';
import type RouteGenerator from './RouteGenerator';

export default function keepRouteCurrent(routeGenerator: RouteGenerator) {
    let currentRoute = computed(routeGenerator);
    autorun(() => {
        navigateToRoute(currentRoute.get());
    });
}
