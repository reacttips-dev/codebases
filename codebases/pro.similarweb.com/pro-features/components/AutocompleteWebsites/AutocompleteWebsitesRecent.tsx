import { colorsPalettes } from "@similarweb/styles";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import React, { FunctionComponent, useCallback } from "react";
import styled from "styled-components";
import { Autocomplete } from "@similarweb/ui-components/dist/autocomplete";
import {
    generateRecents,
    getRecentsAnalysis,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { ListItemSeparator } from "@similarweb/ui-components/dist/list-item/src/items/ListItemSeparator";
import { i18nFilter } from "filters/ngFilters";
import { AutocompleteWebsitesBase } from "components/AutocompleteWebsites/AutocompleteWebsitesBase";
import { IRecentObject } from "userdata";

const translate = i18nFilter();
export const AutocompleteStyled = styled(Autocomplete)`
    width: 100%;
`;
export const PlaceholderText = styled.span`
    color: ${colorsPalettes.carbon["300"]};
    font-family: ${$robotoFontFamily};
    font-size: 14px;
    margin-left: 32px;
`;

interface IAutocompleteWebsitesRecentProps {
    autocompleteProps?: any;
    defaultWebsitePageState: string;
    defaultWebsitePageStateParams?: any;
    onItemClick?(domain: string, iSRecentItem: boolean): void;
}

export const AutocompleteWebsitesRecent: FunctionComponent<IAutocompleteWebsitesRecentProps> = (
    props,
) => {
    const { onItemClick, defaultWebsitePageState, defaultWebsitePageStateParams } = props;
    const [recents, setRecents] = React.useState([]);

    const handleItemClick = (domain: string) => {
        if (typeof onItemClick === "function") {
            const foundRecentObject = recents.find((recent) => {
                return (recent as IRecentObject).data?.mainItem === domain;
            });

            onItemClick(domain, typeof foundRecentObject !== "undefined");
        }
    };

    React.useEffect(() => {
        const getRecents = async (): Promise<void> => {
            const recentItems = await getRecentsAnalysis("website", true);
            setRecents(recentItems);
        };
        getRecents();
    }, []);

    const renderRecents = useCallback(() => {
        return generateRecents(
            recents,
            { website: defaultWebsitePageState },
            <ListItemSeparator key="top-separator">
                {translate("aquisitionintelligence.competitiveanalysis.home.recentsTitle")}
            </ListItemSeparator>,
            defaultWebsitePageStateParams,
        );
    }, [recents]);

    return (
        <AutocompleteWebsitesBase
            renderOnEmptyQuery={renderRecents}
            {...props}
            onItemClick={handleItemClick}
        />
    );
};
