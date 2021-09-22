import React, { CSSProperties, StatelessComponent } from "react";
import Filter from "./Filter";
import { Switcher, TubeSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { sortDirections } from "../../availableFilters";
import styled, { css } from "styled-components";

import { colorsPalettes } from "@similarweb/styles";

const SortDirectionSwitcherItem = styled(TubeSwitcherItem)<{
    customClass?: string;
    selected?: boolean;
}>`
    width: 36px;
    background-color: ${colorsPalettes.bluegrey[100]};
    color: ${colorsPalettes.carbon[400]};
    border-radius: inherit;
    font-size: 14px;
    ${({ selected }) =>
        selected &&
        css`
            cursor: initial;
            background-color: ${colorsPalettes.bluegrey[200]};
            color: ${colorsPalettes.carbon[200]};
        `}
`;

const SortDirection: StatelessComponent<any> = ({ selectedSortDirection, onSortDirection }) => {
    const style = { flexGrow: 0, marginRight: "2.7%" };
    return (
        <Filter fieldName="Order" style={style}>
            <Switcher
                selectedIndex={sortDirections.indexOf(selectedSortDirection)}
                customClass="TubeSwitcher"
                onItemClick={(idx) => onSortDirection(sortDirections[idx])}
            >
                <SortDirectionSwitcherItem customClass="sw-icon-sort-asc" />
                <SortDirectionSwitcherItem customClass="sw-icon-sort-desc" />
            </Switcher>
        </Filter>
    );
};

export default SortDirection;
