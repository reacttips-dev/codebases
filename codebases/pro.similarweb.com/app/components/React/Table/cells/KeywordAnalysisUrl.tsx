import { UpgradeLink } from "components/React/Table/cells/UpgradeLink";
import { UrlCell } from "components/React/Table/cells/UrlCell";
import * as React from "react";
import { FunctionComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

export const KeywordAnalysisUrl: FunctionComponent<ITableCellProps> = ({ value, row }) => {
    const { Domain } = row;

    return (
        <>
            {Domain !== "grid.upgrade" ? (
                <UrlCell site={value} />
            ) : (
                <UpgradeLink hookType="website" />
            )}
        </>
    );
};
