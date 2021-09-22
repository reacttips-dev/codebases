import getUserConfiguration from '../actions/getUserConfiguration';
import setUserConfigurationPonts from '../actions/setUserConfigurationPonts';
import { mutator } from 'satcheljs';

export default mutator(setUserConfigurationPonts, actionMessage => {
    if (getUserConfiguration().UserOptions?.NewEnabledPonts) {
        (<any>getUserConfiguration().UserOptions).NewEnabledPonts &= ~actionMessage.pontType;
    }
});
