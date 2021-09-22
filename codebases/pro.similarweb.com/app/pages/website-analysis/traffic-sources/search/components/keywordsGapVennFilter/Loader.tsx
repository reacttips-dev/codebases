import { CircularLoader as CircularLoaderInner } from "components/React/CircularLoader";
import { i18nFilter } from "filters/ngFilters";
import { filtersConfig } from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/constants";
import {
    Container,
    FilterContainer,
    HorizontalCenter,
    VerticalCenter,
    ChartAndLegendsContainer,
    ChartContainer,
    FiltersContainer,
    FilterSectionTitle,
    FiltersFooterContainer,
} from "pages/website-analysis/traffic-sources/search/components/keywordsGapVennFilter/StyledComponents";
import { TabList, Tabs } from "@similarweb/ui-components/dist/tabs";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { Tab } from "@similarweb/ui-components/dist/tabs/src/..";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders/src/PlaceholderLoaders";

export const AbsoluteCenter = (props) => (
    <VerticalCenter>
        <HorizontalCenter>{props.children}</HorizontalCenter>
    </VerticalCenter>
);

export const CircularLoader = (props) => (
    <AbsoluteCenter>
        <CircularLoaderInner {...props} />
    </AbsoluteCenter>
);

export const KeywordsGapVennFilterLoader = (props) => {
    const { selectedTabIndex } = props;
    const i18n = i18nFilter();
    const circularLoaderOptions = {
        svg: {
            stroke: "#dedede",
            strokeWidth: "4",
            r: 21,
            cx: "50%",
            cy: "50%",
        },
        style: {
            width: 54,
            height: 54,
        },
    };
    const createGhostLoaderItem = () => (
        <FilterContainer>
            <PixelPlaceholderLoader width={"70%"} height={12} />
            <PixelPlaceholderLoader width={"80%"} height={12} />
        </FilterContainer>
    );
    const {
        headers: filterHeaders,
        tabsHeadersKeys,
        marketCoreFilters,
        recommendationsFilters,
    } = filtersConfig;
    return (
        <>
            <Tabs selectedIndex={selectedTabIndex}>
                <TabList>
                    {Object.values(tabsHeadersKeys).map((tabsHeadersKey) => (
                        <Tab>
                            <FlexRow>
                                <div>{i18n(tabsHeadersKey)}</div>
                            </FlexRow>
                        </Tab>
                    ))}
                </TabList>
                <Container>
                    <ChartAndLegendsContainer>
                        <ChartContainer>
                            <CircularLoader options={circularLoaderOptions} />
                        </ChartContainer>
                    </ChartAndLegendsContainer>
                    <FiltersContainer>
                        <FilterSectionTitle>
                            {i18n(filterHeaders.MARKET_CORE_KEY)}
                        </FilterSectionTitle>
                        {marketCoreFilters.map(createGhostLoaderItem)}
                        <FilterSectionTitle>
                            {i18n(filterHeaders.RECOMMENDATIONS_KEY)}
                        </FilterSectionTitle>
                        {recommendationsFilters.map(createGhostLoaderItem)}
                    </FiltersContainer>
                </Container>
            </Tabs>
            <FiltersFooterContainer>
                <PixelPlaceholderLoader width={"70%"} height={12} />
            </FiltersFooterContainer>
        </>
    );
};
