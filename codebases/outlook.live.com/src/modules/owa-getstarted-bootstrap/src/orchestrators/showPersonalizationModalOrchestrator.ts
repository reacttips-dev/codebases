import { orchestrator } from 'satcheljs';
import { showPersonalizationModal } from 'owa-getstarted/lib/actions/showPersonalizationModal';
import { completePersonalization } from 'owa-getstarted/lib/actions/completePersonalization';
import { lazyShowPersonalizationCard } from 'owa-personalization-modal';

orchestrator(showPersonalizationModal, () => {
    lazyShowPersonalizationCard.importAndExecute(completePersonalization);
});
