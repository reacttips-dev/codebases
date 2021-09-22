import { colorsPalettes, rgba } from "@similarweb/styles";
import { setFont } from "@similarweb/styles/src/mixins";
import { Title } from "@similarweb/ui-components/dist/title";
import styled from "styled-components";

export const MainBox = styled.div`
    border-radius: 6px;
    background-color: ${colorsPalettes.carbon["0"]};
`;

export const ButtonBox = styled.div`
    display: flex;
    justify-content: flex-end;

    button:first-child {
        margin-right: 8px;
    }
`;

export const CustomTitle = styled.div`
    ${setFont({ $size: 20, $color: colorsPalettes.carbon[500], $weight: 500 })};
    line-height: 1.2;
    padding-bottom: 8px;
`;

export const Subtitle: any = styled(Title)`
    ${setFont({ $size: 12, $color: rgba(colorsPalettes.carbon[500], 0.6), $weight: "normal" })};
    line-height: 1.33;
    padding-bottom: 19px;
`;

export const SearchLeadsTableContainer = styled.div`
    height: 275px;
    overflow-y: auto;
    margin-bottom: 15px;
    .swReactTable-wrapper .swReactTable-container .swReactTable-pinned {
        &:hover {
            cursor: pointer;
        }
    }
`;
