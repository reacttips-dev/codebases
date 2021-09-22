import type { SelectedData } from 'owa-addins-types';

export default function hasSelectionChanged(oldData: SelectedData, newData: SelectedData): boolean {
    return (
        !(oldData == null && newData == null) &&
        (oldData == null ||
            newData == null ||
            !(
                oldData.data === newData.data &&
                oldData.sourceProperty === newData.sourceProperty &&
                oldData.startPosition === newData.startPosition &&
                oldData.endPosition === newData.endPosition
            ))
    );
}
