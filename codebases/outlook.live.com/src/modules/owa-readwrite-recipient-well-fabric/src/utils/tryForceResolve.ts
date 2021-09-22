import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';
import type { FloatingPeoplePicker } from '@fluentui/react/lib/FloatingPicker';
import findReadWriteRecipient from 'owa-readwrite-recipient-well/lib/actions/findReadWriteRecipient';

export default async function tryForceResolve(
    getViewState: () => FindControlViewState,
    findControl: FloatingPeoplePicker
) {
    await findReadWriteRecipient(
        getViewState(),
        getViewState().queryString,
        true /*searchDirectory*/
    );
    findControl.showPicker(false /*updateValue*/);
    if (getViewState().findResultSet.length == 1) {
        findControl.forceResolveSuggestion();
    }
}
