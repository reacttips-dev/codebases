import * as React from "react";
import { WaCellKeywordBase } from "./WaCellKeywordBase";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";
import { UpgradeLink } from "./UpgradeLink";

export const WaCellKeyword: StatelessComponent<ITableCellProps> = (props: any) => {
    const { row, field, tableOptions } = props;
    const value = row[field];
    return value === "grid.upgrade" ? (
        <UpgradeLink />
    ) : (
        <WaCellKeywordBase
            keyword={value}
            allowLinking={tableOptions.allowedKeywordAnalysisLinking}
            childCount={row.Children && row.Children.length}
            showGoogleSearch={true}
            showAdSearch={true}
        />
    );
};
WaCellKeyword.displayName = "WaCellKeyword";
