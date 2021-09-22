import {
    DropdownListItem,
    SelectedMode,
    TypeOfListItem,
} from "pages/sales-intelligence/common-components/MultiSelector/types";
import { LIST_PERCENTAGES } from "../constans";

export const makeItemLabel = (prefix: string, amount: number): string => {
    return `${prefix} ${amount}`;
};

export const makePrefixItemLabelWithParentheses = (prefix: string) => (amount: number): string => {
    return `${prefix} (${amount})`;
};

export const makeManuallyLabel = (amount: number, translate: (key: string) => string) => {
    if (amount === 0) {
        return translate(`si.multi_selector.button.manually.label`);
    }
    return `${translate("si.multi_selector.button.manually.label")} (${amount})`;
};

const generateRange = (value: number): number[] => {
    return LIST_PERCENTAGES.map((percent) => {
        let result = (value * percent) / 100;
        result -= result % 10; // round to 10
        return result;
    });
};

export const generateDropdownList = (
    table: number,
    quota: number,
    translate: (key: string) => string,
): DropdownListItem[] => {
    let listOfRange = [];

    const minValue = Math.min(table, quota);

    if (minValue > 400) {
        listOfRange = [50, ...generateRange(minValue)];
    } else if (minValue > 50) {
        listOfRange = generateRange(minValue);
    }

    const dropDownList = listOfRange.map((value) => {
        return {
            type: TypeOfListItem.TOP,
            label: makeItemLabel(translate("si.multi_selector.top.label"), value),
            value,
        };
    });

    if (table < quota) {
        dropDownList.push({
            type: TypeOfListItem.ALL,
            label: makeItemLabel(translate("si.multi_selector.all.label"), table),
            value: table,
        });
    } else {
        dropDownList.push({
            type: TypeOfListItem.TOP,
            label: makeItemLabel(translate("si.multi_selector.top.label"), quota),
            value: quota,
        });
    }

    return dropDownList;
};

export const generateDropdownListRemove = (
    selectedDomains: number,
    totalCount: number,
    translate,
) => {
    const list = [];

    list.push({
        type: TypeOfListItem.MANUAL,
        label: makeManuallyLabel(selectedDomains, translate),
        value: selectedDomains,
    });

    list.push({
        type: TypeOfListItem.ALL,
        label: makePrefixItemLabelWithParentheses(
            translate("si.multi_selector.all_websites.label"),
        )(totalCount),
        value: totalCount,
    });

    return list;
};

export const generateListItemsMultiSelectorStates = (
    total: number,
    accountLimit: number,
    excelLimit: number | null,
    selectedDomains: number,
    translate: (key: string) => string,
) => {
    const excelList = () => {
        const listExcel = generateDropdownList(total, excelLimit, translate);

        listExcel.push({
            type: TypeOfListItem.MANUAL,
            label: makeManuallyLabel(selectedDomains, translate),
            value: selectedDomains,
        });

        return listExcel;
    };

    const removeList = () => generateDropdownListRemove(selectedDomains, total, translate);

    const accountList = () => {
        const listAccount = generateDropdownList(total, accountLimit, translate);

        listAccount.push({
            type: TypeOfListItem.MANUAL,
            label: makeManuallyLabel(selectedDomains, translate),
            value: selectedDomains,
        });

        return listAccount;
    };
    return [excelList(), removeList(), accountList()];
};

export const isManuallyMode = (mode: SelectedMode): boolean => SelectedMode.MANUALLY === mode;

export const isFromListMode = (mode: SelectedMode): boolean => SelectedMode.FROM_LIST === mode;
