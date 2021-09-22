import { isFeatureEnabled } from 'owa-feature-flags';
import { protectionStore } from '../../store/protectionStore';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default function (): boolean {
    const { clpLabels } = protectionStore;
    return (
        isFeatureEnabled('cmp-clp') &&
        clpLabels.length > 0 &&
        clpLabels.some(label => label.isLabelEnabled) &&
        !isConsumer()
    );
}
