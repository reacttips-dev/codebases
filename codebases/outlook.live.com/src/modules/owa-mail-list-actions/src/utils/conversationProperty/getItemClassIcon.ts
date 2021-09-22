import getPropertyIconPerItemClass, {
    noteClassPropertyIconMap,
} from './getPropertyIconPerItemClass';
import type IconIndexType from 'owa-service/lib/contract/IconIndexType';
import PropertyIcons from './PropertyIcons';

export function isMeetingType(itemType: string) {
    return itemType.toLowerCase().indexOf('ipm.schedule.meeting') != -1;
}

export default function getItemClassIcon(
    itemClasses: string[],
    iconIndex: IconIndexType,
    hasIrm: boolean
): PropertyIcons {
    if (hasIrm) {
        switch (iconIndex) {
            case 'MailReplied':
                iconIndex = 'MailIrmReplied';
                break;
            case 'MailForwarded':
                iconIndex = 'MailIrmForwarded';
                break;
            default:
                iconIndex = 'MailIrm';
                break;
        }
    }

    // Check to see if all item classes correspond to meeting requests.
    let useIconIndex = false;
    if (itemClasses && itemClasses.length > 0) {
        const numberOfItemClasses = itemClasses.length;
        if (numberOfItemClasses == 1) {
            return getPropertyIconPerItemClass(itemClasses[0], iconIndex);
        } else {
            // Find a conversation icon to use.
            for (let i = 0; i < numberOfItemClasses; i++) {
                if (!isMeetingType(itemClasses[i])) {
                    useIconIndex = true;
                    break;
                }
            }
        }
    } else {
        // We didn't get a list of item classes (this can happen with native host)
        useIconIndex = true;
    }

    return useIconIndex
        ? noteClassPropertyIconMap[iconIndex ? iconIndex.toString() : null]
        : PropertyIcons.MailListViewAppointmentItem;
}
