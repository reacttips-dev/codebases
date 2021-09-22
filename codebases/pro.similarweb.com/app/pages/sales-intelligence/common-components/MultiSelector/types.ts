export enum SelectedMode {
    MANUALLY = "manually",
    FROM_LIST = "from_list",
}

export enum TypeOfListItem {
    MANUAL = "manual",
    TOP = "top",
    ALL = "all",
}

export enum TypeOfSelectors {
    EXCEL = "excel",
    ACCOUNT = "account",
    DELETE = "delete",
}

export type DropdownListItem = {
    type: TypeOfListItem;
    value: number;
    label: string;
};
