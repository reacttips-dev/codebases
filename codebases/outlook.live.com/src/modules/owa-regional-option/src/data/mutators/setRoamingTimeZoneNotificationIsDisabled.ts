import getRegionalOptions from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setRegionalOptionRoamingTimeZoneNotificationIsDisabled',
    function setRoamingTimeZoneNotificationIsDisabled(isDisabled: boolean) {
        let optionState = getRegionalOptions();
        optionState.roamingTimeZoneNotificationIsDisabled = isDisabled;
    }
);
