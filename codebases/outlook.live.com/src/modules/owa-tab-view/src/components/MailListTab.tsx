import type SubTabProps from './SubTabProps';
import { observer } from 'mobx-react-lite';
import { getEffectiveFolderDisplayName } from 'owa-folders';
import { lazyGetGroupDisplayNameFromTableView } from 'owa-group-utils';
import loc from 'owa-localize';
import { searchResults } from 'owa-locstrings/lib/strings/searchresults.locstring.json';
import { getSelectedTableView, TableQueryType } from 'owa-mail-list-store';
import getSelectedFolder from 'owa-mail-store/lib/utils/getSelectedFolder';
import * as React from 'react';

const MailListTab = observer(function MailListTab(props: SubTabProps) {
    const { className, subjectClassName } = props;
    let text: string = '';
    const tableView = getSelectedTableView();
    const isSearchTable = tableView && tableView.tableQuery.type == TableQueryType.Search;
    const isGroupTable = tableView && tableView.tableQuery.type == TableQueryType.Group;

    if (isSearchTable) {
        text = loc(searchResults);
    } else if (isGroupTable) {
        const getGroupDisplayNameFromTableView = lazyGetGroupDisplayNameFromTableView.tryImportForRender();
        if (getGroupDisplayNameFromTableView) {
            text = getGroupDisplayNameFromTableView(tableView);
        }
    } else {
        const folder = getSelectedFolder();

        if (folder) {
            text = getEffectiveFolderDisplayName(folder);
        }
    }

    return (
        <div className={className} title={text}>
            <div className={subjectClassName}>{text}</div>
        </div>
    );
});
export default MailListTab;
