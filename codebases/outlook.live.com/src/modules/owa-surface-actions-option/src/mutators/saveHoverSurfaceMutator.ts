import getStore from '../store/store';
import { updateUserConfiguration } from 'owa-session-store/lib/actions/updateUserConfiguration';
import saveHoverSurfaceAction from '../actions/saveHoverSurfaceAction';
import { getMailTriageActionsFromHoverActionKeys } from '../utils/hoverSurfaceActionHelper';
import { mutator, orchestrator } from 'satcheljs';

mutator(saveHoverSurfaceAction, actionMessage => {
    getStore().hoverSurfaceActions = actionMessage.hoverActionKeys;
});

orchestrator(saveHoverSurfaceAction, actionMessage => {
    const mailTriageActions = getMailTriageActionsFromHoverActionKeys(
        actionMessage.hoverActionKeys
    );
    updateUserConfiguration(config => {
        config.ViewStateConfiguration.MailTriageOnHoverActions = mailTriageActions;
    });
});
