import { resetPendingUILess } from '../store/pendingUILess';
import { action } from 'satcheljs/lib/legacy';

export default action('timeoutResetUiLessExtendedAddinCommand')(
    function timeoutResetUiLessExtendedAddinCommand(controlId: string) {
        resetPendingUILess(controlId);
    }
);
