import { lazyOnItemNavigation, SelectionType } from 'owa-addins-core';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default async function updateAddinOnItemNavigation(
    selectionType: SelectionType,
    hostItemIndex: string = null
) {
    !isConsumer() && (await lazyOnItemNavigation.import())(selectionType, hostItemIndex);
}
