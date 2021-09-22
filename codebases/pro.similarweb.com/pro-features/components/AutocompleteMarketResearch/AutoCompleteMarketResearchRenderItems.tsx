import React from "react";
import { TabList, TabPanel, Tabs } from "@similarweb/ui-components/dist/tabs";
import { NoSearchResultsFound } from "@similarweb/ui-components/dist/autocomplete";
import {
    ScrollAreaWrap,
    TabStyled,
    ScrollAreaRecents,
} from "components/AutocompleteMarketResearch/AutocompleteMarketResearchStyles";
import { SWReactIcons } from "@similarweb/icons";

export const AutoCompleteMarketResearchRenderItems: React.FunctionComponent = (props: any) => {
    const { listItems } = props;
    const { showResents, items, query } = listItems;
    const [selectedTabIndex, setSelectedTabIndex] = React.useState<number>(0);
    const tabIcons = { Website: "globe", App: "app" };

    const scrollWrapperRef = React.useRef(null);
    React.useEffect(() => {
        if (scrollWrapperRef.current) {
            scrollWrapperRef.current.scrollTop();
        }
    }, [query]);

    if (showResents === undefined) {
        return null;
    }

    if (query === "") {
        if (items.length === 0) {
            return null;
        }
        return (
            <div className="ListItemsContainer">
                <ScrollAreaRecents>{items}</ScrollAreaRecents>
            </div>
        );
    } else {
        const { apps, websites } = items;
        const noResultsFound = <NoSearchResultsFound searchTerm={query} />;

        return (
            <div className="ListItemsContainer">
                {items && (
                    <Tabs selectedIndex={selectedTabIndex} onSelect={setSelectedTabIndex}>
                        <TabList>
                            <TabStyled>
                                <SWReactIcons iconName={tabIcons.Website} size={"xs"} />
                                Websites
                            </TabStyled>
                            <TabStyled>
                                <SWReactIcons iconName={tabIcons.App} size={"xs"} />
                                Apps
                            </TabStyled>
                        </TabList>
                        <TabPanel>
                            <ScrollAreaWrap ref={scrollWrapperRef}>
                                {websites.length === 0 ? noResultsFound : websites}
                            </ScrollAreaWrap>
                        </TabPanel>
                        <TabPanel>
                            <ScrollAreaWrap ref={scrollWrapperRef}>
                                {apps.length === 0 ? noResultsFound : apps}
                            </ScrollAreaWrap>
                        </TabPanel>
                    </Tabs>
                )}
            </div>
        );
    }
};
