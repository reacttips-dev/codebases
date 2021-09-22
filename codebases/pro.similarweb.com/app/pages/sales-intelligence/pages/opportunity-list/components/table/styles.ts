import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";

export const StyledTablePagination = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    display: flex;
    justify-content: flex-end;
    padding: 8px 0;
`;

export const StyledSearchContainer = styled.div`
    align-items: center;
    display: flex;
    flex-grow: 1;
    padding: 8px 16px 8px 0;
    height: 40px;

    .SearchInput-container {
        flex-grow: 1;
    }

    .SearchInput {
        height: 34px;
        background-color: ${colorsPalettes.carbon[0]};
        border: none;
        width: 100%;
        box-sizing: border-box;
        padding: 9px 2px 5px 50px;
        box-shadow: none;
        margin-bottom: 0;
        :focus {
            box-shadow: none !important;
            border: none;
        }
    }
`;

export const StyledSearchSection = styled.div`
    align-items: center;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    display: flex;
    justify-content: space-between;
    padding-right: 24px;
`;

export const StyledTableContainer = styled.div`
    padding-bottom: 100px;
`;

export const StyledStaticList = styled.div`
    .swReactTable-header-wrapper.css-sticky-header {
        top: 56px;
    }
`;

/**
 * showCheckBox
 * width of column receive from function getColumnsSalesIntelligence
 * 200 - width of column(Website) next field after column checkBox;
 * 48 - width of column checkBox;
 */

export const StaticListTableWrapper: any = styled.div<{ loading: boolean; showCheckBox: boolean }>`
    pointer-events: ${({ loading }: any) => (loading ? "none" : "all")};

    .swReactTable-pinned > {
        div:nth-child(1) {
            display: ${({ showCheckBox }) => (showCheckBox ? "block" : "none")};
        }
        div:nth-child(2) {
            flex-basis: ${({ showCheckBox }) => (showCheckBox ? "200" : "248")}px !important;
        }
    }
    .swReactTable-wrapper {
        .swReactTable-pinned > {
            div:nth-child(1) {
                display: ${({ showCheckBox }) => (showCheckBox ? "block" : "none")};
            }
            div:nth-child(2) {
                flex-basis: ${({ showCheckBox }) => (showCheckBox ? "200" : "248")}px !important;
            }
        }
    }
`;
