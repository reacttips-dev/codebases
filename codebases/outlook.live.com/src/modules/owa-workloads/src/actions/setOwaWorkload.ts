import store from '../store/store';
import type OwaWorkload from '../store/schema/OwaWorkload';
import { mutatorAction } from 'satcheljs';

let setOwaWorkload = mutatorAction('setOwaWorkload', function (workload: OwaWorkload) {
    store.currentWorkload = workload;
});

export default setOwaWorkload;
