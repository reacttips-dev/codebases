import { mutator } from 'satcheljs';
import { getStore } from '../store/store';
import { CommandBarAction } from '../store/schema/CommandBarAction';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import loadCommandBarActions from '../actions/loadCommandBarActions';
import { getCommandBarActionFromString } from '../utils/getCommandBarActionFromString';

mutator(loadCommandBarActions, () => {
    const commandBarConfig = getCommandBarActionFromString(
        getUserConfiguration()?.ViewStateConfiguration?.MailTriageActionConfig
    );

    const indexOfOverflow = commandBarConfig.indexOf(CommandBarAction.Overflow);
    getStore().surfaceActions = commandBarConfig.slice(0, indexOfOverflow);
    getStore().overflowActions = commandBarConfig.slice(indexOfOverflow + 1);
});
