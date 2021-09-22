import * as React from "react";
import { StatelessComponent } from "react";
import { CellKeywordContent } from "./CellKeywordContent";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const CellKeyword: StatelessComponent<ITableCellProps> = (props) => {
    return <CellKeywordContent {...props} showAdsButton={true}></CellKeywordContent>;
};
CellKeyword.displayName = "CellKeyword";
