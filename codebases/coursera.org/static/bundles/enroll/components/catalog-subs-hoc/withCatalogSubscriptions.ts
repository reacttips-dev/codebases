import withCatalogSubscriptionBySlug from 'bundles/enroll/components/catalog-subs-hoc/withCatalogSubscriptionBySlug';

import withCatalogSubscriptionPrice from 'bundles/enroll/components/catalog-subs-hoc/withCatalogSubscriptionPrice';
import withCatalogSubscriptionUserStates from 'bundles/enroll/components/catalog-subs-hoc/withCatalogSubscriptionUserStates';

type Options = {
  withProductPrice?: boolean;
  bySlug?: boolean;
};

function withCatalogSubscription(Component: any, { withProductPrice, bySlug }: Options = {}) {
  let WrappedComponent = Component;

  if (withProductPrice) {
    WrappedComponent = withCatalogSubscriptionPrice(WrappedComponent);
  }

  WrappedComponent = withCatalogSubscriptionUserStates(WrappedComponent);

  if (bySlug) {
    WrappedComponent = withCatalogSubscriptionBySlug(WrappedComponent);
  }

  return WrappedComponent;
}

export default withCatalogSubscription;
