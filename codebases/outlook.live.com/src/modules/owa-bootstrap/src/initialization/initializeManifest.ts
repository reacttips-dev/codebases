import { orchestrator } from 'satcheljs';
import { onLocaleChanged, getCurrentLanguage } from 'owa-localize';
import { getQueryStringParameter, hasQueryStringParameter, isGulpingValue } from 'owa-querystring';
import { isFeatureEnabled } from 'owa-feature-flags';

export function initializeManifest() {
    updateManifestLink(getCurrentLanguage());
}

function updateManifestLink(culture: string) {
    if (isFeatureEnabled('fwk-localized-manifests') && !isGulpingValue) {
        let newManifestUrl = `/mail/manifests/pwa.json?culture=${culture}`;
        if (hasQueryStringParameter('branch')) {
            newManifestUrl += `&branch=${getQueryStringParameter('branch')}`;
        }
        const elem = document.head.querySelector("link[rel='manifest']") as HTMLLinkElement;
        if (elem) {
            elem.href = newManifestUrl;
        }
    }
}

orchestrator(onLocaleChanged, ({ locale }) => updateManifestLink(locale));
