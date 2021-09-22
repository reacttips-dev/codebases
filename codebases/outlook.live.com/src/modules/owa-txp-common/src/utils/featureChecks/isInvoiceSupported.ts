import isEntitySupported from './isEntitySupported';
import { INVOICE_ENTITY_NAMES_MAP_VALUE } from '../../helpers/TxpCommonConstants';
import { isFeatureEnabled } from 'owa-feature-flags';
import { INVOICE_FEATURE } from '../../helpers/FeatureFlagName';

export default function isInvoiceSupported(entityNamesMap: number): boolean {
    return isEntitySupported(
        entityNamesMap,
        INVOICE_ENTITY_NAMES_MAP_VALUE,
        isFeatureEnabled(INVOICE_FEATURE)
    );
}
