import * as React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { ReactNode, StatelessComponent } from "react";
import { IMarketingMixTableRow } from "../MarketingMixTable/src/MarketingMixTable.types";
import { ITotalVisitsSectionData } from "../../../../app/pages/workspace/marketing/pages/MarketingOverview.types";

export const StyledCell = styled.div`
    box-sizing: border-box;
    height: 48px;
    line-height: 48px;
    display: flex;
    align-content: center;
    color: ${colorsPalettes.carbon[500]};
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    ${setFont({ $size: 14 })};
    .swReactTableCell & {
        line-height: 20px;
    }
`;
type Item = IMarketingMixTableRow | ITotalVisitsSectionData;
interface IDefaultCellProps {
    value?: number;
    children?: ReactNode;
    className?: string;
    cellEnter?: (item: Item) => void;
    cellLeave?: (item: Item) => void;
    row?: Item;
    selectedTableRow?: Item;
}

export const DefaultCell: StatelessComponent<IDefaultCellProps> = (props) => {
    const {
        className,
        children,
        cellEnter = () => {},
        cellLeave = () => {},
        row,
        selectedTableRow,
        value,
    } = props;
    return (
        <StyledCell
            className={
                selectedTableRow && selectedTableRow === row ? `selected ${className}` : className
            }
            onMouseEnter={() => {
                cellEnter(row);
            }}
            onMouseLeave={() => {
                cellLeave(row);
            }}
        >
            {children || value}
        </StyledCell>
    );
};
