import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export function allowMultipleSortCaching(): boolean {
    return isHostAppFeatureEnabled('multiSortTableCaching');
}
