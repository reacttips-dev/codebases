import { SWReactIcons } from "@similarweb/icons";
import styled, { css } from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import { setFont } from "@similarweb/styles/src/mixins";
import { Tab } from "@similarweb/ui-components/dist/tabs";
import { TabList } from "@similarweb/ui-components/dist/tabs";

export const AutocompleteStyled = styled(Autocomplete)`
    width: 100%;
    &:hover {
        box-shadow: 0px 3px 5px ${colorsPalettes.carbon[25]};
        border: 2px;
    }
`;

export const getIconColor = (selectedIndex, tab) => {
    const isSelected = selectedIndex === tab - 1;
    return isSelected ? colorsPalettes.blue[400] : colorsPalettes.carbon[400];
};

export const Icon = styled(SWReactIcons)<{ color?: string }>`
    height: 16px;
    width: 16px;
    display: flex;
    padding-right: 8px;
    ${({ color }) =>
        `
            svg path {
            fill: ${color};
        }
    `}
`;

export const SelectedSiteContainer = styled.div`
    display: flex;
    background-color: white;
    display: flex;
    align-items: center;
    border: 1px solid ${colorsPalettes.carbon[25]};
    min-height: 48px;
    border-radius: 8px;
    padding: 0 8px 0 16px;
`;

export const Container = styled.div<{ width?: string }>`
    .AutocompleteWithTabs {
        div:first-child {
            border: none;
        }
    }
    border: 1px solid ${colorsPalettes.carbon[50]};
    border-radius: 3px;
    ${({ width }) => width && `width:${width}`};
`;

export const ItemContainer = styled.div`
    margin: 0px 10px;
    padding: 8px 6px;
`;

export const ItemsContainer = styled.div`
    max-height: 230px;
    overflow-y: auto;
    border-top: 1px solid ${colorsPalettes.carbon[50]};
    ${ItemContainer}+${ItemContainer} {
        border-top: 1px solid ${colorsPalettes.carbon[50]};
    }
`;

export const FakeInputContainerStyled = styled.div<{ isValid: boolean }>`
    .ListItemWebsite {
        height: 34px;
        margin-bottom: 2px;
    }

    border: 1px solid ${colorsPalettes.carbon["100"]};
    border-radius: 3px;
    padding: 2px 0px;
    width: 100%;
    ${({ isValid }) =>
        !isValid &&
        `
            border-color: ${colorsPalettes.red["400"]};
        `}
`;

export const DotsLoaderContainer = styled.div`
    display: flex;
    justify-content: center;
    padding-left: 50px;
    width: 100%;
`;

export const FullList = styled.div`
    background-color: ${colorsPalettes.bluegrey[200]};
    padding: 10px 16px;
    ${setFont({ $size: 14, $color: colorsPalettes.carbon[400] })}
`;

export const CustomTab = styled(Tab)<{ width: string }>`
    ${({ width }) => `width: ${width};`}
    justify-content: start;
`;

export const CustomTabList = styled(TabList)`
    display: grid;
    grid-template-columns: 145px 200px;
`;
