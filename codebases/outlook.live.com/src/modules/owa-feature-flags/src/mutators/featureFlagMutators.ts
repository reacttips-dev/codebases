import updateActiveFlights from '../actions/updateActiveFlights';
import getStore from '../store/Store';
import { mutator } from 'satcheljs';

mutator(updateActiveFlights, actionMessage => {
    for (const override of actionMessage.featureOverrides) {
        getStore().featureFlags.set(override.name.toLowerCase(), override.isEnabled);
    }
});
