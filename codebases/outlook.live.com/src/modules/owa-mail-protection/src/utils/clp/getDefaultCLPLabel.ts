import { protectionStore } from '../../store/protectionStore';
import type CLPLabel from 'owa-mail-protection-types/lib/schema/CLPLabel';

export default function (): CLPLabel {
    const { clpLabels } = protectionStore;
    return getDefaultLabelFromList(clpLabels);
}

function getDefaultLabelFromList(labels: CLPLabel[]) {
    for (let i = 0; i < labels.length; i++) {
        if (labels[i].isDefault) {
            return labels[i];
        }
        const defaultLabelInSubMenu = getDefaultLabelFromList(labels[i].children);
        if (defaultLabelInSubMenu) {
            return defaultLabelInSubMenu;
        }
    }
    return null;
}
