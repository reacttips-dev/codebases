import { SelectionType } from 'owa-addins-core';
import { isGroupTableSelected } from 'owa-group-utils';
import { updateAddinOnItemNavigation } from '../index';

export default function updateAddinOnNavigationToEmptyNullReadingPane(): void {
    if (isGroupTableSelected()) {
        updateAddinOnItemNavigation(SelectionType.NotSupported);
    } else {
        updateAddinOnItemNavigation(SelectionType.Empty);
    }
}
