import {
  // @ts-ignore
  windowUndefined,
} from '../../../helpers/serverRenderingUtils';

/**
 * Braze (formerly known as appboy)
 * initialization guide: https://www.braze.com/docs/developer_guide/platform_integration_guides/web/initial_sdk_setup/#install-cdn
 *
 * Braze SDK is installed via Google Tag Manger and we set the current user here
 *
 */
export function initializeBraze(mParticleId: string) {
  if (!windowUndefined()) {
    if (mParticleId) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: 'userIsLoggedIn' });
    }
    if (window.appboy) {
      window.appboy.changeUser(mParticleId);
    }
  }
}
