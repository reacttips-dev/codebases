import GoogleTagManager from 'bundles/ads-tracking/GoogleTagManager';
import shouldLoadAdTracking from 'bundles/ads-tracking/shouldLoadAdTracking';

/**
 * Enable ads tracking where it can be done safely.
 * (e.g. no Google in China, password reset url, internal, superuser, instructor, admin pages)
 * This function should only be loaded after the cookie banner script has been loaded (if you're in the experiment)
 */
export default function safeEnableAdsTracking() {
  if (!shouldLoadAdTracking()) {
    return;
  }

  // @ts-ignore ts-migrate(7009) FIXME: 'new' expression, whose target lacks a construct s... Remove this comment to see the full error message
  const googleTagManager = new GoogleTagManager();
  googleTagManager.ensureLibLoaded();
}
