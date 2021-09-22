import React from "react";
import classNames from "classnames";
import { changeFilter } from "filters/ngFilters";
import Table from "pages/workspace/sales/components/custom-table/Table/Table";
import { CompetitorsTableProps } from "./types";
import Watermark from "pages/sales-intelligence/common-components/Watermark/Watermark";
import { StyledWatermark } from "./styles";

const format = changeFilter();

const CompetitorsTable = ({ data, columns, id }: CompetitorsTableProps): JSX.Element => {
    const renderChangeColumn = (changeValue: number) => {
        const classes = classNames("changePercentage", "competitor-table-change-column", {
            negative: changeValue < 0,
            positive: changeValue > 0,
        });

        const iconClasses = classNames("changePercentage-icon", {
            "sw-icon-arrow-up5": changeValue > 0,
            "sw-icon-arrow-down5": changeValue < 0,
        });

        return (
            <span className={classes}>
                <i className={iconClasses} />
                {format(Math.abs(changeValue), undefined)}
            </span>
        );
    };

    return (
        <>
            <div id={id}>
                <Table
                    data={data}
                    columns={columns}
                    customRenderers={{
                        change: renderChangeColumn,
                    }}
                />
            </div>
            <StyledWatermark>
                <Watermark />
            </StyledWatermark>
        </>
    );
};

export default CompetitorsTable;
