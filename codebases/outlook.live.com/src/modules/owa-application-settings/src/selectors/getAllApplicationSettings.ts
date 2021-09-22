import * as trace from 'owa-trace';
import getStore from '../store/store';

import type { ApplicationSettings } from '../store/schema/ApplicationSettings';

export default function getAllApplicationSettings(): ApplicationSettings {
    const store = getStore();

    if (!store.initialized && !process.env.JEST_WORKER_ID) {
        trace.errorThatWillCauseAlert(
            'Attempted to read settings before application settings were initialized.'
        );
    }

    return store.settings;
}
