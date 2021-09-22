import { xor } from './utils/xor';
import { TableQueryType, getSelectedTableView } from 'owa-mail-list-store';

export const tableQueryTypeRestriction = (
    tableQueryTypes: TableQueryType[],
    shouldHide?: boolean
) => () => {
    const {
        tableQuery: { type },
    } = getSelectedTableView();
    const isTableQueryInRestrictionList = tableQueryTypes.includes(type);

    return xor(shouldHide, isTableQueryInRestrictionList);
};
