import LocalizationService, {
    MANAGED_REGIONS
} from '../../services/localization-service';
import Analytics from '@udacity/ureact-analytics';

export default {
    track: function(eventName, options) {
        const baseOptions = {
            geolocation: LocalizationService.getGeoLocation()
        };

        return Analytics.track(eventName, { ...baseOptions,
            ...options
        });
    },
    trackEmailLeadGenEvent: function(email) {
        const referredByWWW = document.referrer.match(
            /^https?:\/\/www.udacity.com/
        );
        const countryCode = LocalizationService.getGeoLocation();
        const isManagedRegion = MANAGED_REGIONS.includes(countryCode);
        const isHqUser = referredByWWW || !isManagedRegion;
        const fireGTM = isHqUser;

        if (fireGTM) {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
                event: 'emailSubmitted'
            });
        }

        Analytics.track('Marketing Qualified Lead Form Submitted', {
            category: 'Lead Generation',
            label: `Lead Generation - ${
        isHqUser ? 'HQ' : 'Intl'
      } - Account Signup (AuthWeb)`,
            formId: 'Account Signup (AuthWeb)',
            geolocation: countryCode,
            country: countryCode,
            email: email,
            gtm_activated: fireGTM
        });
    }
};