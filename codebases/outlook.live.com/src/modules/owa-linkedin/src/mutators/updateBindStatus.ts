import { mutatorAction } from 'satcheljs';
import { linkedInStore } from '../store/store';
import type { BindStatus } from '../store/schema/BindStatus';

export let updateBindStatus = mutatorAction('updateBindStatus', (bindStatus: BindStatus) => {
    let store = linkedInStore();
    store.status = bindStatus;
});
