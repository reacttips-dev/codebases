import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import styled from "styled-components";

export const OuterIcon = styled(SWReactIcons).attrs({
    iconName: "link-out",
    size: "xs",
})`
    display: inline-block;
    vertical-align: sub;
    path {
        fill: ${colorsPalettes.carbon["400"]};
    }
`;
