import * as React from "react";
import { CellKeywordContent } from "./CellKeywordContent";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const CellKeywordNoAds: StatelessComponent<ITableCellProps> = (props) => {
    return <CellKeywordContent {...props} showAdsButton={false}></CellKeywordContent>;
};
CellKeywordNoAds.displayName = "CellKeywordNoAds";
