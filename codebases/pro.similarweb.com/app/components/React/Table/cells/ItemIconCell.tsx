import * as React from "react";
import { StatelessComponent } from "react";
import { ITableCellProps } from "../interfaces/ITableCellProps";

import { UpgradeLink } from "./UpgradeLink";

export const ItemIconCell: StatelessComponent<ITableCellProps> = ({
    value,
    row,
    tableOptions,
    tableMetadata,
}) => {
    const template = <div>{value}</div>;
    const upgradeTemplate = <UpgradeLink />;
    return value === "grid.upgrade" ? upgradeTemplate : template;
};
ItemIconCell.displayName = "ItemIconCell";
