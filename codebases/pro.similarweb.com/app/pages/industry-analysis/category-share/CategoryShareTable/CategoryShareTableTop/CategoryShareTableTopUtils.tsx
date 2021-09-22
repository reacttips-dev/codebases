import { IColumnsPickerLiteProps } from "@similarweb/ui-components/dist/columns-picker";

export const createTableFilter = (filterKey: string, filterTerm) => {
    return `${filterKey};contains;"${filterTerm.trim()}"`;
};

export const getColumnsPickerLiteProps = (
    tableColumns: any[],
    onClickToggleColumns: (index: any) => void,
): IColumnsPickerLiteProps => {
    const columns = tableColumns.reduce((res, col, index) => {
        if (!col.fixed) {
            return [
                ...res,
                {
                    key: index.toString(),
                    displayName: col.displayName,
                    visible: col.visible,
                },
            ];
        }
        return res;
    }, []);
    return {
        columns,
        onColumnToggle: (key) => {
            // tslint:disable-next-line:radix
            onClickToggleColumns(parseInt(key));
        },
        onPickerToggle: () => null,
    };
};
