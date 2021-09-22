import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export default function shouldShowOwaBrandElement(shouldShowBrand: boolean) {
    if (isHostAppFeatureEnabled('showOwaBranding')) {
        const brandElement = document.getElementById('owaBranding_container');
        if (!brandElement) {
            return;
        }

        if (shouldShowBrand) {
            brandElement.style.display = 'inherit';
        } else {
            brandElement.style.display = 'none';
        }
    }
}
