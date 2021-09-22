import { emptyFolderText } from 'owa-locstrings/lib/strings/emptyfoldertext.locstring.json';
import { emptyFocused, emptyOther, emptyFolder } from './getEmptyFolderText.locstring.json';
import loc from 'owa-localize';

import type TableView from '../store/schema/TableView';
import FocusedViewFilter from 'owa-service/lib/contract/FocusedViewFilter';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { FolderForestNodeType } from 'owa-favorites-types';
import getFocusedFilterForTable from './getFocusedFilterForTable';
import { TableQueryType } from '../store/schema/TableQuery';

export default function getEmptyFolderText(tableView: TableView): string {
    const focusedFilter = getFocusedFilterForTable(tableView);
    const selectedNode = getSelectedNode();

    if (focusedFilter !== FocusedViewFilter.None) {
        return focusedFilter === FocusedViewFilter.Focused ? loc(emptyFocused) : loc(emptyOther);
        // We are in search/persona/category scenario
    } else if (
        tableView.tableQuery.type === TableQueryType.Search ||
        selectedNode.type === FolderForestNodeType.PrivateDistributionList ||
        selectedNode.type === FolderForestNodeType.Category ||
        selectedNode.type === FolderForestNodeType.Persona
    ) {
        // 'Delete all' (indicates that only emails in view will be deleted)
        return loc(emptyFolder);
    } else {
        // 'Empty folder' (indicates entire folders' contents will be deleted)
        return loc(emptyFolderText);
    }
}
