import { EBooleanSearchActionsTypes } from "@similarweb/ui-components/dist/boolean-search/src/BooleanSearch";

export const actionListItems = (translate: (key: string) => string) => [
    {
        text: `${translate("si.sidebar.contacts.search.include.title")} `,
        action: EBooleanSearchActionsTypes.includeKeyword,
        glue: " OR ",
        icon: "search-keywords",
    },
    {
        text: `${translate("si.sidebar.contacts.search.exclude.title")} `,
        action: EBooleanSearchActionsTypes.excludeKeyword,
        glue: " OR ",
        icon: "keywords-exclude",
    },
];
