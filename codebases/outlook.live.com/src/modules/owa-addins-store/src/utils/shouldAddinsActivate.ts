import type Item from 'owa-service/lib/contract/Item';

export default function shouldActivateAddins(
    item: Pick<Item, 'ItemClass' | 'IsDraft' | 'RightsManagementLicenseData'>
): boolean {
    if (item.RightsManagementLicenseData != null) {
        // IRM
        return false;
    } else if (item.IsDraft) {
        // DRAFT
        return false;
    } else {
        const itemClass = item.ItemClass ? item.ItemClass.toLowerCase() : '';
        if (
            itemClass.indexOf('ipm.note.smime') == 0 &&
            itemClass.indexOf('ipm.note.smime.multipartsigned') == -1
        ) {
            // SMIME Encrypted
            return false;
        } else if (itemClass.indexOf('report') == 0) {
            // Report includes NDR (non-delivery receipt), DR (delivery receipt), RN (read notification), NRN (not read notification), delay (delay notification), etc.
            return false;
        }
    }

    return true;
}
