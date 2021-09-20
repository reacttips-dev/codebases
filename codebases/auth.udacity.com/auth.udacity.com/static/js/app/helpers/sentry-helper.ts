import * as Sentry from '@sentry/browser';

// Could clean this up, it's backwards-compatible to all the JS code calling
// with a sparsely populated object.
type Notify = {
  descrip: string;
  component: string;
  // error is an unexpected failure (5xx or unexpected 4xx) for a fetch
  error?: object;
  extra?: { [key: string]: string };
};

export default {
  notify: function(n: Notify): void {
    const { descrip, component, error, extra } = n;
    Sentry.withScope((scope: Sentry.Scope): void => {
      scope.setTag('component', component);
      if (extra) {
        Object.keys(extra).forEach((key) => {
          scope.setExtra(key, extra[key]);
        });
      }
      if (error) {
        scope.setExtra('error', JSON.stringify(error));
      }
      Sentry.captureMessage(descrip);
    });
  }
};
