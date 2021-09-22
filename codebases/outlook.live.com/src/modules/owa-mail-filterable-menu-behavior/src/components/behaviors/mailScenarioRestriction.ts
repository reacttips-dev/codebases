import { xor } from './utils/xor';
import {
    getSelectedTableView,
    MailFolderTableQuery,
    TableView,
    MailFolderScenarioType,
} from 'owa-mail-list-store';

export const mailScenarioRestriction = (
    scenarios: MailFolderScenarioType[],
    shouldHide?: boolean
) => () => {
    const tableView: TableView = getSelectedTableView();

    const isScenarioInRestrictionList = scenarios.includes(
        (tableView.tableQuery as MailFolderTableQuery).scenarioType
    );

    return xor(shouldHide, isScenarioInRestrictionList);
};
