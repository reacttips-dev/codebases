import getStore from '../store/store';
import type { TableQuery } from 'owa-mail-list-store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'onSpotlightRowsAppendedToTable',
    (spotlightTableQuery: TableQuery) => {
        getStore().spotlightTableQuery = spotlightTableQuery;
    }
);
