import styled from "styled-components";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { colorsPalettes, fonts } from "@similarweb/styles";
import { SWReactIcons } from "@similarweb/icons";

export const PageTitleStyle = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;

    span {
        > * {
            margin-right: 10px;
        }
    }
`;

export const TitleStyle = styled.div`
    font-family: ${fonts.$dmSansFontFamily};
    font-size: 24px;
    font-weight: 500;
    line-height: 1.17;
    color: ${colorsPalettes.carbon[500]};
    white-space: nowrap;
`;

export const TooltipStyle = styled.div`
    margin: 0 5px;
`;

export const EducationIconStyle = styled.div`
    margin-right: 24px;
    cursor: pointer;
`;

export const IconButtonStyled = styled(IconButton)`
    ${SWReactIcons} {
        svg {
            path {
                fill: #4f8df9;
            }
        }
    }
`;
