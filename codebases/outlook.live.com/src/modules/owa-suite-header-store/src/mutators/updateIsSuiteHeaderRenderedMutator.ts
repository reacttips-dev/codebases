import { updateIsSuiteHeaderRendered } from '../actions/publicActions';
import { mutator } from 'satcheljs';
import { getStore } from '../store/store';

export const updateIsSuiteHeaderRenderedMutator = mutator(updateIsSuiteHeaderRendered, () => {
    getStore().isRendered = true;
});
