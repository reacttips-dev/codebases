import * as classNames from "classnames";
import * as React from "react";
import GAVerifiedContainer from "../../../GAVerifiedIcon/GAVerifiedContainer";

/**
 * Created by Sahar.Rehani on 1/19/2017.
 */
export const MiniFlexTableColumn: any = ({ columnConfig, columnCells, style }) => {
    return (
        <div
            className={classNames(
                "u-relative",
                columnConfig.columnClass,
                columnConfig.isSortedClass,
            )}
            style={style}
        >
            {columnCells}
        </div>
    );
};

export const MiniFlexTableHeaderCell: any = ({
    index,
    columnConfig,
    onColumnReformat,
    onSort,
    tableMetadata,
    track,
    tableData,
}) => {
    return (
        <div className={columnConfig.headerCellClass}>
            <columnConfig.HeaderComponent
                key={"h" + index}
                {...columnConfig}
                tableMetadata={tableMetadata}
                onColumnReformat={onColumnReformat}
                onSort={onSort}
                track={track}
                tableData={tableData}
            />
        </div>
    );
};

export const MiniFlexTableCell: any = ({
    columnConfig,
    row,
    rowIndex,
    tableOptions,
    tableMetadata,
    track,
    items,
}) => {
    const GAVerifiedIcon = row.isGAVerified ? (
        <GAVerifiedContainer
            size={"SMALL"}
            isActive={true}
            isPrivate={row.isGAPrivate}
            tooltipAvailable={true}
            tooltipIsActive={false}
            metric={tableOptions.metric}
        />
    ) : null;
    return (
        <div className={columnConfig.cellClass}>
            <columnConfig.CellComponent
                key={rowIndex}
                rowIndex={rowIndex}
                row={row}
                items={items}
                value={row[columnConfig.field]}
                tableOptions={tableOptions}
                tableMetadata={tableMetadata}
                {...columnConfig}
                track={track}
                GAVerifiedIcon={GAVerifiedIcon}
            />
        </div>
    );
};
