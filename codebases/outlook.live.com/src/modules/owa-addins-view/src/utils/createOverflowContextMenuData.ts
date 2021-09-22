import { overflowMenuHeaderAddins } from './createOverflowContextMenuData.locstring.json';
import loc from 'owa-localize';
import ContextMenuData from './ContextMenuData';
import createAddinContextMenuDataItem from './createAddinContextMenuDataItem';

import type { Addin } from 'owa-addins-store';

export default function createOverflowContextMenuData(addins: Addin[]): ContextMenuData {
    const data = new ContextMenuData('AddinsHeader', loc(overflowMenuHeaderAddins));
    for (const addin of addins) {
        data.addItem(createAddinContextMenuDataItem(addin));
    }
    return data;
}
