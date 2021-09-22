import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { ItemIcon } from "@similarweb/ui-components/dist/item-icon";
import { MiniFlexTable } from "@similarweb/ui-components/dist/mini-flex-table";
import { StatelessComponent } from "react";
import * as React from "react";
import styled from "styled-components";
import { ChannelCell } from "../../../../.pro-features/components/Workspace/TableCells/ChannelCell";
import {
    DefaultCell,
    StyledCell,
} from "../../../../.pro-features/components/Workspace/TableCells/DefaultCell";
import {
    DefaultHeaderCell,
    StyledHeaderCell,
} from "../../../../.pro-features/components/Workspace/TableCells/DefaultHeaderCell";
import {
    ReferringCategoryCell,
    ReferringCategoryDashboardCell,
    TrafficShare,
} from "../../../components/React/Table/cells";
import { i18nFilter } from "../../../filters/ngFilters";
import { LinkCell } from "../../../../.pro-features/components/Workspace/TableCells/LinkCell";

interface ICategoryDistributionDomains {
    icon: string;
    color: string;
    name: string;
}
interface ICategoryDistributionProps {
    domains: ICategoryDistributionDomains[];
    data: any[];
    getLink: (value) => string;
}

const StyledTable: any = styled(MiniFlexTable)`
    padding-bottom: 0px;
    height: 100%;
    .MiniFlexTable-container {
        height: 100%;
    }
    .MiniFlexTable-column {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 100%;
        border-right: 1px solid ${colorsPalettes.carbon[100]};
        &:last-of-type {
            border-right: 0;
        }
        &:first-of-type {
            .MiniFlexTable-headerCell {
                ${StyledHeaderCell} {
                    padding-left: 15px;
                }
            }
        }
        .MiniFlexTable-headerCell {
            ${StyledHeaderCell} {
                padding-left: 10px;
                border-bottom: 0px;
                border-top: 0;
            }
        }
        .MiniFlexTable-cell {
            ${StyledCell} {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                padding-left: 15px;
                border: 0px;
                height: 40px;
                line-height: 31px;
                display: inline;
            }
        }
        .MiniFlexTable-cell {
            .swTable-progressBar {
                ${setFont({ $size: 14 })};
                padding-left: 12px;
                padding-right: 21px;
                box-sizing: border-box;
                height: 40px;
                line-height: 40px;
                display: flex;
                align-content: center;
                color: ${colorsPalettes.carbon[500]};
                text-align: right;
                > {
                    &:not(:last-child) {
                        margin-right: 15px;
                    }
                }
            }
            .min-value {
                min-width: 45px;
            }
        }
    }
`;
const HeaderWithIcon = (domain) => () => {
    const StyledItemIcon = styled(ItemIcon)`
        margin-right: 3px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
        border-color: #d6dbe1;
        .ItemIcon-img {
            width: 12px;
            height: 12px;
        }
    `;
    const Wrapper = styled(StyledHeaderCell)`
        display: flex;
        align-items: center;
    `;
    return (
        <Wrapper>
            <StyledItemIcon iconName="" iconSrc={domain.icon} />
            <span> {domain.name} </span>
        </Wrapper>
    );
};

const StyledCellCategory = styled(DefaultCell)`
    color: #1593e4;
`;

const createColumns = (domains, getLink) => {
    const columns: any[] = [
        {
            field: "category",
            displayName: i18nFilter()(
                "analysis.referrals.incoming.categorydistribution.column.category",
            ),
            headerComponent: DefaultHeaderCell,
            cellComponent: (props) => {
                const { value, row } = props;
                if (value === "Others") {
                    return <DefaultCell {...props} />;
                } else {
                    return (
                        <StyledCellCategory>
                            <LinkCell href={getLink(row.categoryApi)} value={value} title={value} />
                        </StyledCellCategory>
                    );
                }
            },
            visible: true,
            minWidth: 300,
            width: "auto",
        },
    ];
    domains.forEach((domain) => {
        const newColumn = {
            field: domain.name,
            displayName: domain.name,
            headerComponent: HeaderWithIcon(domain),
            cellComponent: TrafficShare,
            minWidth: 100,
            maxWidth: 300,
            visible: true,
            innerColor: domain.color,
        };
        columns.push(newColumn);
    });
    return columns;
};

const Component: StatelessComponent<ICategoryDistributionProps> = ({ domains, data, getLink }) => {
    return (
        <StyledTable
            className="MiniFlexTable"
            data={data}
            columns={createColumns(domains, getLink)}
        />
    );
};

Component.displayName = "CategoryDistribution";
export const CategoryDistribution = Component;
