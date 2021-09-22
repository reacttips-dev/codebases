import { updateShySuiteHeaderMode } from '../actions/publicActions';
import { mutator } from 'satcheljs';
import { getStore } from '../store/store';

export const updateShySuiteHeaderModeMutator = mutator(updateShySuiteHeaderMode, ({ isShy }) => {
    getStore().isShy = isShy;
});
