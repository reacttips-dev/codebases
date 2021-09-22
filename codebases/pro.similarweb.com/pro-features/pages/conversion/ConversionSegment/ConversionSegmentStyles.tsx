import styled from "styled-components";
import { StyledPill } from "styled components/StyledPill/src/StyledPill";
import { colorsPalettes } from "@similarweb/styles";
import { Tab, TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";

export const OrangeStyledPill = styled(StyledPill)`
    background-color: ${colorsPalettes.orange["400"]};
    text-transform: uppercase;
    font-size: 10px;
    margin-left: 8px;
    padding: 4px 7px;
`;

export const TabListStyled = styled(TabList)`
    border-bottom: 0;
    padding-left: 24px;
    z-index: 1;
    .disabled {
        ${OrangeStyledPill} {
            background-color: ${colorsPalettes.carbon["200"]};
        }
    }
`;

export const TabsContainer = styled.div`
    background-color: ${colorsPalettes.carbon[0]};
    box-shadow: 0px 4px 6px 0px rgba(202, 202, 202, 0.5);
    z-index: 9;
    border-bottom: 1px solid ${colorsPalettes.carbon[50]};
    position: sticky;
    top: 0;
`;

export const ContentContainer = styled.div`
    flex-grow: 1;
    display: flex;
    padding: 24px 0px;
    justify-content: center;
    background-color: ${colorsPalettes.bluegrey["100"]};
    ${TabPanel} {
        margin: 0 auto;
    }
    .react-tabs {
        width: 100%;
    }
`;
