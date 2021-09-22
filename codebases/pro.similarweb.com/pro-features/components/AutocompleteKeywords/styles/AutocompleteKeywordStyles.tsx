import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Tab } from "@similarweb/ui-components/dist/tabs";

export const AutocompleteStyled = styled(Autocomplete)`
    width: 100%;
    .ListItem.ListItemKeyword {
        height: 48px;
    }
`;

export const NoResultsContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: 400;
    flex-direction: row;
    height: 42px;
    color: ${colorsPalettes.carbon[400]};
    padding: 12px 20px 10px 14px;
    background-color: ${colorsPalettes.carbon[0]};

    span {
        margin-left: 6px;
    }
`;

export const InnerTitleContainer = styled.div`
    height: 40px;
    text-transform: uppercase;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    padding-left: 15px;
    user-select: none;
    background-color: ${colorsPalettes.carbon[0]};
`;

export const StyledTab = styled(Tab)`
    min-width: 80px;
    display: flex;
    justify-content: flex-start;
`;
