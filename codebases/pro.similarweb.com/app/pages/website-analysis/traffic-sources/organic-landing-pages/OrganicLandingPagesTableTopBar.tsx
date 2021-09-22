import styled from "styled-components";
import { DownloadExcelContainer, SearchContainer } from "pages/workspace/StyledComponent";
import { FunctionComponent } from "react";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { ListItemWebsite } from "@similarweb/ui-components/dist/list-item";
import { DomainsChipDownContainer } from "@similarweb/ui-components/dist/dropdown";
import { PlainTooltip } from "components/React/Tooltip/PlainTooltip/PlainTooltip";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { colorsPalettes } from "@similarweb/styles";
import { DownloadButtonMenu } from "components/React/DownloadButtonMenu/DownloadButtonMenu";
import * as queryString from "query-string";
import { DEFAULT_SORT } from "pages/website-analysis/traffic-sources/organic-landing-pages/OrganicLandingPagesColumnsConfig";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { AddToDashboard } from "pages/website-analysis/TrafficAndEngagement/ChartUtilities/AddToDashboard";
import { devicesTypes } from "UtilitiesAndConstants/Constants/DevicesTypes";

const ChipdownItem = styled.div`
    flex-grow: 0;
    margin-right: 8px;
    margin-left: 8px;
`;

const TopStyled = styled.div`
    display: flex;
    align-items: center;
    font-size: 14px;
    padding: 12px;
`;

const FilterItemCheckbox = styled.div`
    width: auto !important;
    display: inline-flex;
    margin: 0 8px;
`;

const OrganicLandingPagesTableHeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 16px;
    border-top: 1px solid ${colorsPalettes.carbon[100]};
    ${SearchContainer} {
        border-top: none;
    }
`;

export const OrganicLandingPagesTableTopBar: FunctionComponent<any> = (props) => {
    const {
        domains,
        onSelectDomain,
        showDomainSelector,
        filtersStateObject,
        selectedDomain,
        excelDownloadUrl,
        excelAllowed,
        sort = DEFAULT_SORT,
        asc = false,
        chosenItems,
    } = props;
    const IncludeTrendingPages = filtersStateObject.IncludeTrendingPages === true.toString();
    const IncludeNewPages = filtersStateObject.IncludeNewPages === true.toString();
    if (IncludeTrendingPages && IncludeNewPages) {
        // setTimeout in order to prevent the "$digest already in progress" error
        // by moving the onFilterChange method execution to the end of the queue
        setTimeout(() => props.onFilterChange({ IncludeTrendingPages: false }, true), 0);
    }
    const queryParams = { ...filtersStateObject, sort, asc };
    const excelDownloadUrlParams = `${excelDownloadUrl}?${queryString.stringify(queryParams)}`;

    const onSearch = (value) => {
        TrackWithGuidService.trackWithGuid("organic.landing.pages.filters.search", "switch", {
            value: value,
        });
        props.onFilterChange({ filter: value }, true);
    };

    const onNewlyCheck = () => {
        TrackWithGuidService.trackWithGuid("organic.landing.pages.filters.newlypages", "switch", {
            value: !IncludeNewPages,
        });
        props.onFilterChange({ IncludeNewPages: !IncludeNewPages }, true);
    };

    const onTrendingCheck = () => {
        TrackWithGuidService.trackWithGuid(
            "organic.landing.pages.filters.trendingpages",
            "switch",
            { value: !IncludeTrendingPages },
        );
        props.onFilterChange({ IncludeTrendingPages: !IncludeTrendingPages }, true);
    };

    const selectedDomainObj = selectedDomain
        ? domains.find((domain) => domain.name === selectedDomain)
        : domains[0];

    const getDomainsOptions = () => {
        return domains.map(({ name, icon }, index) => {
            return <ListItemWebsite key={index} text={name} img={icon} />;
        });
    };

    const domainsSelector = selectedDomainObj && (
        <ChipdownItem>
            <DomainsChipDownContainer
                width={200}
                onClick={onSelectDomain}
                selectedDomainText={selectedDomainObj.name}
                selectedDomainIcon={selectedDomainObj.icon}
                onCloseItem={onSelectDomain}
                buttonText={"aaa"}
            >
                {getDomainsOptions()}
            </DomainsChipDownContainer>
        </ChipdownItem>
    );
    const isNewlyDiscoveredDisabled = IncludeTrendingPages;
    const isTrendingPagesDisabled = IncludeNewPages;

    const trackExcelDownload = () => {
        TrackWithGuidService.trackWithGuid("organic.landing.pages.table.excel.download", "click");
    };

    return (
        <>
            <TopStyled>
                {i18nFilter()("keyword.analysis.ads.page.filterby")}
                {showDomainSelector && domainsSelector}
                <FilterItemCheckbox key={`checkbox-newly`}>
                    <PlainTooltip
                        placement="top"
                        text={i18nFilter()(
                            isNewlyDiscoveredDisabled
                                ? "organic.landing.pages.table.filters.newly.tooltip.disabled"
                                : "organic.landing.pages.table.filters.newly.tooltip",
                        )}
                    >
                        <div>
                            <Checkbox
                                isDisabled={isNewlyDiscoveredDisabled}
                                onClick={onNewlyCheck}
                                label={i18nFilter()(
                                    "organic.landing.pages.table.filters.newly.label",
                                )}
                                selected={IncludeNewPages}
                            />
                        </div>
                    </PlainTooltip>
                </FilterItemCheckbox>
                <FilterItemCheckbox key={`checkbox-trending`}>
                    <PlainTooltip
                        placement="top"
                        text={i18nFilter()(
                            isTrendingPagesDisabled
                                ? "organic.landing.pages.table.filters.trending.tooltip.disabled"
                                : "organic.landing.pages.table.filters.trending.tooltip",
                        )}
                    >
                        <div>
                            <Checkbox
                                isDisabled={isTrendingPagesDisabled}
                                onClick={onTrendingCheck}
                                label={i18nFilter()(
                                    "organic.landing.pages.table.filters.trending.label",
                                )}
                                selected={IncludeTrendingPages}
                            />
                        </div>
                    </PlainTooltip>
                </FilterItemCheckbox>
            </TopStyled>
            <OrganicLandingPagesTableHeaderStyled>
                <SearchContainer>
                    <SearchInput
                        defaultValue={props.search}
                        disableClear={true}
                        debounce={700}
                        onChange={onSearch}
                        placeholder={i18nFilter()(
                            "organic.landing.pages.table.filters.search.placeholder",
                        )}
                    />
                </SearchContainer>
                <FlexRow>
                    <DownloadExcelContainer href={excelDownloadUrlParams}>
                        <DownloadButtonMenu
                            Excel={true}
                            downloadUrl={excelDownloadUrlParams}
                            exportFunction={trackExcelDownload}
                            excelLocked={!excelAllowed}
                        />
                    </DownloadExcelContainer>
                    <AddToDashboard
                        metric={{
                            addToDashboardName: "OrganicLandingPage",
                            chartType: "OrganicLandingPagesDashboard",
                            title: "1",
                        }}
                        webSource={devicesTypes.DESKTOP}
                        filters={{ ...filtersStateObject }}
                        overrideParams={{
                            key: chosenItems.filter(({ name }) => name === filtersStateObject.key),
                            IncludeTrendingPages,
                            IncludeNewPages,
                        }}
                    />
                </FlexRow>
            </OrganicLandingPagesTableHeaderStyled>
        </>
    );
};
