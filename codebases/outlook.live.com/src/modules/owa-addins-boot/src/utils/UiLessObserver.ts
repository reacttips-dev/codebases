import { isAnyUilessAddinRunning } from 'owa-addins-store';
import { when } from 'mobx';

export default function whenNoRunningUiLessAddinOnHostItem(
    hostItemIndex: string,
    delegate: (hostItemIndex: string) => void
): void {
    if (!isAnyUilessAddinRunning(hostItemIndex)) {
        delegate(hostItemIndex);
    } else {
        when(
            () => !isAnyUilessAddinRunning(hostItemIndex),
            () => delegate(hostItemIndex)
        );
    }
}
