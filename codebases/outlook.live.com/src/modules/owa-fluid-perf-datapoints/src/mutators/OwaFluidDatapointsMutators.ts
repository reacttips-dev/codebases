import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';
import { isFluidOwaSourceValidForPerfScenario } from '../utils/isFluidOwaSourceValidForPerfScenario';
import type { FluidOwaSource } from 'owa-fluid-validations';
import type { OWAFluidCheckmarksEnum } from '../utils/OWAFluidCheckmarksEnum';

export const reportPerfCheckmark = mutatorAction(
    'reportPerfCheckmark',
    (ch: OWAFluidCheckmarksEnum, owaSource: FluidOwaSource) => {
        if (isFluidOwaSourceValidForPerfScenario(owaSource)) {
            getStore().checkmarks.set(ch, { isReached: true, time: 0 });
        }
    }
);

export const markCheckmarkAsReached = mutatorAction(
    'markCheckmarkAsReached',
    (ch: OWAFluidCheckmarksEnum, time: number, owaSource: FluidOwaSource) => {
        if (isFluidOwaSourceValidForPerfScenario(owaSource)) {
            getStore().checkmarks.set(ch, { isReached: true, time: time });
        }
    }
);

export const setFluidOwaSource = mutatorAction('setFluidOwaSource', (value: FluidOwaSource) => {
    getStore().fluidOwaSource = value;
});

export const resetStore = mutatorAction('resetStore', () => {
    const store = getStore();

    for (let i = 0; i < store.checkmarks.size; i++) {
        store.checkmarks.clear();
    }
});
