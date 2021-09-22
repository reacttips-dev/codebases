import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { ButtonLabel, IconButtonStyled } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";

export const BoxContainer = styled.div`
    box-sizing: border-box;
    width: calc(100% - 60px);
    max-width: 1200px;
    align-self: center;
    flex: auto;
    overflow: auto;
    display: flex;
    flex-direction: column;
    background: ${colorsPalettes.carbon[0]};
    border: 1px solid ${colorsPalettes.midnight[50]};
    padding: 10px 0 0;
    margin: 0;
    & > * {
        padding-left: 30px;
        padding-right: 30px;
    }

    @media screen and (max-width: 640px) {
        width: calc(100% - 10px);
    }
`;

export const TitleContainer = styled.h3`
    & > .indicator {
        display: inline;
        font-size: 70%;
        font-weight: 400;
        vertical-align: baseline;
        color: ${colorsPalettes.carbon[200]};
        margin-left: 0.5em;
    }
`;

export const ListContainer = styled.div`
    flex: auto;
    overflow: auto;
    display: flex;
    flex-direction: column;

    @media screen and (max-height: 640px) {
        flex: none;
    }
`;

export const FiltersContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    border-bottom: 1px solid ${colorsPalettes.midnight[50]};
    margin: 0 -30px;
    padding: 5px 30px;
`;

export const PagerContainer = styled.div`
    margin-left: auto;
`;

export const ContentContainer = styled.div`
    padding: 15px 30px;
`;

export const ContentError = styled.span`
    color: ${colorsPalettes.red[400]};
`;

export const TableContainer = styled.div`
    flex: auto;
    overflow: auto;
    min-height: 3em;
    margin: 0 -30px;
    padding: 0;
`;

export const InlineIcon = styled(SWReactIcons)`
    display: inline-block;
    vertical-align: text-bottom;
    margin-right: 3px;
`;

export const SearchContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;

    & > * {
        margin: 3px 5px;
    }

    .input-container {
        height: 25px !important;
        min-width: 240px;
        font-size: 12px;
        line-height: 14px;
        input {
            font-size: 12px;
            line-height: 14px;
        }
    }

    .srTypeDropdownButton {
        height: 23px;
    }

    ${IconButtonStyled} {
        height: 25px !important;

        ${ButtonLabel} {
            font-size: 12px;
        }

        &.srIconButtonCircle {
            width: 25px !important;
        }

        &.srIconButtonReset {
            .SWReactIcons {
                width: 13px;
                height: 13px;
            }

            svg {
                width: 100%;
                height: 100%;
            }
        }
    }
`;

export const ModalHeader = styled.div`
    font-size: 16px;
    line-height: 20px;
    font-weight: 500;
    text-align: center;
    color: ${colorsPalettes.carbon[500]};
    margin-bottom: 1.5em;
`;

export const ModalBody = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
`;

export const ModalFooter = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 1.5em;
`;

export const PreJson = styled.div`
    flex: auto;
    white-space: pre;
    color: ${colorsPalettes.carbon[500]};
    border: 1px solid ${colorsPalettes.carbon[100]};
    background-color: ${colorsPalettes.carbon[50]};
    padding: 0.5em;
    overflow: auto;
`;

export const PartName = styled.div<any>`
    flex: none;
    flex-basis: ${({ fullRow }) => (fullRow ? "18%" : "36%")};
    font-weight: 500;
    margin-right: 0.5em;
`;

export const PartValue = styled.div`
    flex: auto;
`;

export const Part = styled.div<any>`
    display: flex;
    flex-direction: row;
    flex: none;
    flex-basis: ${({ fullRow }) => (fullRow ? "100%" : "50%")};
    margin: 5px 0;

    @media screen and (max-width: 480px) {
        flex-basis: 100%;
        ${PartName} {
            flex-basis: 36%;
        }
    }
`;

export const IsDeleted = styled.div`
    color: ${colorsPalettes.red[500]};
    .isDeletedFlag {
        font-weight: 500;
    }
`;
