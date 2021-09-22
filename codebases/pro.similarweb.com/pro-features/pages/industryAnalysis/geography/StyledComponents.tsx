import { colorsPalettes, colorsSets } from "@similarweb/styles";
import * as React from "react";
import styled from "styled-components";
import { StyledPageHeading } from "../../../styled components/StyledPageHeading/src/StyledPageHeading";
import { StyledPageSubHeading } from "../../../../app/pages/industry-analysis/outgoing-links/StyledComponents";
import { TabSwitchItem } from "@similarweb/ui-components/dist/switcher";

export const GeoContainer = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 100%;
    align-items: center;
    ${StyledPageHeading} {
        align-items: left;
        width: 100%;
    }
    ${StyledPageSubHeading} {
        align-items: left;
        width: 100%;
    }
`;

export const TabsContainer: any = styled.div`
    flex-grow: 1;
    flex-basis: 100%;
    .tabsInner {
        text-transform: uppercase;
        padding-bottom: 11px;
        border-bottom: 1px solid ${colorsPalettes.carbon["100"]};
    }
    ${TabSwitchItem} {
        @media (max-width: 1281px) {
            padding: 14px 37px;
        }
    }
`;
TabsContainer.displayName = "TabsContainer";
