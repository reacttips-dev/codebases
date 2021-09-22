import styled, { css } from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes, rgba } from "@similarweb/styles";
import { Title } from "@similarweb/ui-components/dist/title";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { StyledBoxTitleContainer } from "styled components/Workspace/src/StyledWorkspaceBox";
import {
    ComponentWrapper,
    TextWrapper,
} from "@similarweb/ui-components/dist/dropdown/src/buttons/NoBorderButton";
import { ChipItemWrapper } from "@similarweb/ui-components/dist/chip/src/elements";
import { SimpleDropdownItem } from "@similarweb/ui-components/dist/dropdown";

export const Container = styled.div`
    ${Title} {
        display: flex;
        align-items: center;
    }
`;

export const Subtitle = styled.div<{ indent?: number; opacity?: number }>`
    font-size: 14px;
    color: ${colorsPalettes.carbon["500"]};
    font-weight: 400;
    ${({ indent }) => (indent ? `margin: ${indent}px 0;` : "")}
    ${({ opacity }) => (opacity ? `opacity: ${opacity};` : "")}
`;

export const ListTitle = styled(Title)`
    display: flex;
    align-items: center;
`;

export const StyledFilterWrapper = styled.div`
    .ChipItemText,
    .CountryFilter-dropdownButton,
    .DropdownButton-text,
    .WebSourceFilter-dropdownButton {
        font-size: 14px;
        color: ${colorsPalettes.carbon["500"]};
        font-weight: 400;
    }
`;

export const Name = styled.span`
    margin-right: 1px;
`;

export const StyledDropdownsWrapper = styled(FlexRow)`
    .DropdownButton--filtersBarDropdownButton {
        border-left: 0;

        &:hover {
            border-left: 0;
        }
    }
`;

export const StyledSalesBoxTitleContainer = styled(StyledBoxTitleContainer)`
    padding-bottom: 0;
    padding-top: 20px;
`;

export const StyledTableFiltersContainer = styled(Subtitle)`
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin-bottom: 18px;
    margin-top: 5px;
    padding: 0 24px;
`;

export const StyledPredefinedViewsButton = styled(ComponentWrapper)`
    background-color: ${rgba(colorsPalettes.carbon[500], 0.1)};
    border-radius: 40px;
    padding: 4px 12px;
    height: 32px;
    box-sizing: border-box;

    ${TextWrapper} {
        &,
        * {
            font-size: 13px;
        }
    }

    &:hover {
        background-color: ${rgba(colorsPalettes.carbon[500], 0.16)};
    }

    ${({ disabled }) =>
        disabled &&
        css`
            cursor: not-allowed;
        `}
`;

export const StyledPredefinedViewsItem = styled(SimpleDropdownItem)`
    color: ${colorsPalettes.carbon["500"]};
    font-size: 14px;
    font-weight: 400;
    height: 48px;
    line-height: 48px;

    &.DropdownItem--selected {
        color: ${colorsPalettes.blue["500"]};
    }
`;

export const StyledCountryDropdownButton = styled.div`
    ${ChipItemWrapper} {
        cursor: pointer;
        margin: 0 16px 0 0;

        &:hover {
            background-color: ${rgba(colorsPalettes.carbon[500], 0.16)};
        }
    }

    ${SWReactIcons} {
        display: flex;
        padding: 0 12px 0 8px;
        path {
            fill: ${colorsPalettes.carbon["200"]};
        }

        &:hover {
            fill: ${colorsPalettes.carbon["300"]};
        }
    }
`;

export const CustomMetricsButtonContent = styled(FlexRow)`
    & span {
        margin-right: 8px;
    }

    ${SWReactIcons} {
        margin-left: 0;
    }
`;
