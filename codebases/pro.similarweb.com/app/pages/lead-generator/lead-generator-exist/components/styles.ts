import styled, { css } from "styled-components";
import { FlexRow } from "../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { NewDataLabel } from "../../lead-generator-all/components/elements";
import { colorsPalettes } from "@similarweb/styles";

export const Container = styled(FlexRow)`
    align-items: center;
    justify-content: space-between;
    .cell-padding {
        padding-right: 2px;
        width: 100%;
        ${(props) =>
            (props.isNew &&
                css`
                    width: calc(100% - 39px);
                `) ||
            (props.isReturning &&
                css`
                    width: calc(100% - 71px);
                `)}
    }
    .swTable-linkOut {
        display: none;
    }
    &:hover {
        & .infoIcon {
            opacity: 1;
        }
    }
`;

export const LeadLabel = styled(NewDataLabel)`
    width: ${(props: { width: number }) => `${props.width}px`};
    flex-basis: ${(props) => `${props.width}px`};
    @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
        /* IE10+ CSS */
        width: ${(props: { width: number }) => `${props.width - 6}px`};
        flex-basis: ${(props: { width: number }) => `${props.width - 6}px`};
    }
    text-align: center;
    display: inline;
    box-sizing: border-box;
    margin: 0 0 0 auto;
    padding: 2px;
    transform: scale(1);
    opacity: 1;
    transition: all 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94);
    margin-left: 10px;
`;

export const StyledInfoIconWrapper = styled.div`
    transition: all 500ms ease-out;
    opacity: 0;
    border-radius: 50%;
    padding: 3px;
    width: 32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
            background-color: ${colorsPalettes.carbon["50"]};
        }
    }
`;

export const StyledContentWrapper = styled.div`
    padding-left: 9px;
`;

export const StyledCellContainer = styled.div`
    &:hover {
        cursor: pointer;
    }
`;

export const StyledDomainContainer = styled.div`
    width: 95%;
    height: 100%;
    position: absolute;
    top: 0px;
    display: grid;
    &:hover {
        cursor: pointer;
    }
`;

export const StyledLeftDomainCell = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
`;

export const StyledRightDomainCell = styled.div`
    display: flex;
    justify-content: flex-end;
    align-items: center;
`;
