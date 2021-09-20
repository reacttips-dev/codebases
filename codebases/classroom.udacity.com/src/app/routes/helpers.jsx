import AnalyticsService from 'services/analytics-service';

export function makeRoute(path, component, options) {
  return _.extend({ path, component }, options);
}

export function makeIndexRoute(component, options) {
  return _.extend({ component }, options);
}

export function makeRouteWithAnalytics(path, component) {
  return makeRoute(path, component, {
    onEnter: () => AnalyticsService.page(path),
  });
}
