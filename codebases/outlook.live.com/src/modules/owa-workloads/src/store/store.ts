import type OwaWorkloadStore from './schema/OwaWorkloadStore';
import OwaWorkload from './schema/OwaWorkload';
import { createStore } from 'satcheljs';

let owaWorkloadStore: OwaWorkloadStore = {
    currentWorkload: OwaWorkload.None,
};

export default createStore<OwaWorkloadStore>('owaWorkload', owaWorkloadStore)();
