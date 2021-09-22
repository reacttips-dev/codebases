import styled from "styled-components";
import { colorsPalettes, mixins } from "@similarweb/styles";
import {
    BooleanSearch,
    BooleanSearchActionListStyled,
    Input,
    BooleanSearchInputWrap,
} from "@similarweb/ui-components/dist/boolean-search";

const BooleanSearchWrapper = styled.div`
    border-radius: 3px;
    border: solid 1px ${colorsPalettes.carbon[100]};
    padding: 5px 10px;
    ${BooleanSearchActionListStyled} {
        background-color: #fff;
    }
    ${BooleanSearchInputWrap} {
        min-width: 0;
    }
    ${Input} {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
`;

export const FiltersWrap = styled.div`
    display: flex;
    margin-left: 25px;
    align-items: center;
    margin-bottom: 10px;
    min-height: 32px;
`;

export const circularLoaderOptions = {
    svg: {
        stroke: "#dedede",
        strokeWidth: "4",
        r: 12,
        cx: "50%",
        cy: "50%",
    },
    style: {
        width: 32,
        height: 32,
        marginLeft: "15px",
    },
};

export const InnerWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

export const ResultCountWapper = styled.div`
    color: ${colorsPalettes.carbon["200"]};
`;

export const StyledBooleanSearchWrapper = styled(BooleanSearchWrapper)`
    padding: 10px 10px;
    border-radius: 0px;
    border-left: 0px;
    border-right: 0px;
    border-color: ${colorsPalettes.carbon[50]};
    display: flex;
    justify-content: space-between;
    .boolean-search {
        flex-grow: 1;
    }
`;

export const StyledLabel = styled.span`
    ${mixins.setFont({ $color: colorsPalettes.carbon[500], $weight: 300, $size: 14 })};
`;

export const ChipWrap = styled.div`
    padding-left: 8px;
`;

export const TopTableFiltersBarContainer = styled.div`
    position: relative;
    z-index: 1;
`;
