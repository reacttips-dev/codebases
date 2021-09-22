import { colorsPalettes, rgba } from "@similarweb/styles";
import { Title } from "@similarweb/ui-components/dist/title";
import * as React from "react";
import styled from "styled-components";

const StyledBoxSubtitle: any = styled(Title).attrs({
    "data-automation-box-subtitle": true,
})`
    display: flex;
    flex-direction: row;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.2px;
    text-align: left;
    color: ${rgba(colorsPalettes.carbon[500], 0.8)};
`;
StyledBoxSubtitle.displayName = "StyledBoxSubtitle";
export default StyledBoxSubtitle;
