import { IAppCompareItem } from "components/compare/AppsQueryBar/AppsQueryBar";
import { autocompleteStates } from "components/compare/WebsiteQueryBar";
import React from "react";

export interface IAutocompleteAppsProps {
    data?: any;
    currentStore?: string;
    onClick?: (competitor) => () => void;
    getListItems?: (query: string) => Promise<IAppCompareItem[] | autocompleteStates[]>;
    getRenderItems?: (selectedItemId: any, listItems: any) => any;
    onCloseButtonClick?: (e) => void;
    excludes?: any;
    autocompleteProps?: any;
    onKeyUp?: (e) => void;
    onArrowKeyPress?: (e) => void;
    overrideEnterFunc?: (e) => void;
    className?: string;
    children?: React.ReactNode;
}

export interface IAutocompleteStyledProps {
    width?: number | string;
    position?: string;
    top?: number | string;
    left?: string;
    right?: string;
}

export enum ListItemsTypes {
    RECENT = "recent",
    SIMILAR = "similar",
    QUERY = "query",
}
