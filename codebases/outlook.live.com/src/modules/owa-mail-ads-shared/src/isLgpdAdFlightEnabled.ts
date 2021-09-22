import { isFeatureEnabled } from 'owa-feature-flags';

export default function isLgpdAdFlightEnabled(): boolean {
    const isLgpdFeatureEnabled =
        isFeatureEnabled('adsexp-Lgpd-buttonstring-0') ||
        isFeatureEnabled('adsexp-Lgpd-buttonstring-1') ||
        isFeatureEnabled('adsexp-Lgpd-buttonstring-2') ||
        isFeatureEnabled('adsexp-Lgpd-buttonstring-3') ||
        isFeatureEnabled('adsexp-Lgpd-buttonstring-4') ||
        isFeatureEnabled('adsexp-Lgpd-buttonstring-5') ||
        isFeatureEnabled('adsexp-Lgpd-buttonstring-6') ||
        isFeatureEnabled('adsexp-Lgpd-buttonstring-7') ||
        isFeatureEnabled('adsexp-Lgpd-buttonstring-8');
    return isLgpdFeatureEnabled;
}
