import { SimpleDropdownItem, WebSourceDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import {
    SidebarListCompactElement,
    SidebarListCompactElementItem,
} from "@similarweb/ui-components/dist/responsive-filters-bar";
import { swSettings } from "common/services/swSettings";
import { DurationSelectorPresetOriented } from "components/duration-selectors/DurationSelectedPresetOriented";
import { CountryFilter } from "components/filters-bar/country-filter/CountryFilter";
import { CountryFilterCompact } from "components/filters-bar/country-filter/CountryFilterCompact";
import { DropdownFilter } from "components/filters-bar/dropdown-filter/DropdownFilter";
import GaFilter from "components/filters-bar/ga-filter/GaFilter";
import { WebSourceFilter } from "components/filters-bar/websource-filter/WebSourceFilter";
import ContactUsItemWrap from "components/React/ContactUs/ContactUsItemWrap";
import ResponsiveFiltersBarPro from "components/React/ResponsiveFiltersBarPro/ResponsiveFiltersBarPro";
import { i18nFilter } from "filters/ngFilters";
import { Dayjs } from "dayjs";
import { DurationSelectorCompact } from "pages/website-analysis/DurationSelectorCompact";
import { DurationSelectorSidebarButton } from "pages/website-analysis/DurationSelectorSidebarButton";
import { DurationSelectorSimple } from "pages/website-analysis/DurationSelectorSimple";
import {
    getPaidOrganicFilterItems,
    PaidOrganicFilter,
} from "pages/workspace/marketing/shared/PaidOrganicFilter";
import { FC, useState } from "react";
import styled from "styled-components";

export enum ESubdomainsType {
    INCLUDE = "include",
    EXCLUDE = "exclude",
}

const MarketingWorkspaceFiltersContainer = styled.span`
    .SidebarList-panel-control--open,
    .SidebarList-panel-view--open,
    .SidebarListCompactElement {
        overflow: auto;
    }
`;

interface IMarketingWorkspaceFiltersProps {
    // country
    selectedCountryId: number;
    selectedCountryText: string;
    availableCountries: any[];
    onCountryChange: (country) => void;
    // duration
    onDurationChange: (duration) => void;
    maxDate: Dayjs;
    minDate: Dayjs;
    durationSelectorPresets: any;
    duration: string;
    componentId: string;
    // websource
    availableWebSources: any[];
    selectedWebSource: {
        icon: string;
        text: string;
        id: string;
    };
    onWebSourceChange: (webSource) => void;
    webSourceFilterDisabled?: boolean;
    // include subdomains
    showIncludeSubdomainsFilter: boolean;
    isIncludeSubdomains?: boolean;
    includeSubdomainsDisabled?: boolean;
    onSubDomainsFilterChange?: (type) => void;
    // paid/organic
    showKeywordsTypeFilter: boolean;
    onKeywordsTypeChange?: (item) => void;
    selectedKeywordsType?: string;
    // GA toggle
    showGaToggle?: boolean;
}

export const MarketingWorkspaceFilters: FC<IMarketingWorkspaceFiltersProps> = ({
    selectedCountryId,
    selectedCountryText,
    onCountryChange,
    availableCountries,
    onDurationChange,
    maxDate,
    minDate,
    durationSelectorPresets,
    duration,
    componentId,
    availableWebSources,
    selectedWebSource,
    onWebSourceChange,
    webSourceFilterDisabled,
    isIncludeSubdomains,
    onSubDomainsFilterChange,
    showIncludeSubdomainsFilter,
    showKeywordsTypeFilter,
    onKeywordsTypeChange,
    selectedKeywordsType,
    showGaToggle,
    includeSubdomainsDisabled = false,
}) => {
    const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const onSideBarToggle = (isOpen) => {
        setSidebarOpen(isOpen);
    };

    const onFiltersSidebarListCompactElementItemChangeProp = (item, cb) => {
        return async () => {
            setSidebarOpen(false);
            setTimeout(() => {
                cb(item);
            }, 400);
        };
    };

    const includeSubdomainsItems = [
        {
            id: ESubdomainsType.INCLUDE,
            text: i18nFilter()("workspace.marketing.arena.filters.include.subdomains"),
            value: ESubdomainsType.INCLUDE,
            children: null,
            selected: isIncludeSubdomains,
        },
        {
            id: ESubdomainsType.EXCLUDE,
            text: i18nFilter()("workspace.marketing.arena.filters.exclude.subdomains"),
            value: ESubdomainsType.EXCLUDE,
            children: null,
            selected: !isIncludeSubdomains,
        },
    ];

    const fixedCompactFilters = showGaToggle
        ? [
              {
                  listItem: (
                      <GaFilter label={i18nFilter()("analysis.ga.toggle.label")} key="filter-ga" />
                  ),
              },
          ]
        : [];

    const durationSelectorFilter = !swSettings.user.isShortMonthIntervalsUser ? (
        <DurationSelectorSimple
            key="duration-filter"
            compareAllowed={false}
            isDisabled={false}
            onSubmit={onDurationChange}
            maxDate={maxDate}
            minDate={minDate}
            presets={durationSelectorPresets}
            initialPreset={duration}
            initialComparedDuration={false}
            componentName={componentId}
            keys={""}
            height={64}
            appendTo={"body"}
            placement="bottom-right"
        />
    ) : (
        <DurationSelectorPresetOriented
            minDate={minDate}
            maxDate={maxDate}
            isDisabled={false}
            onSubmit={onDurationChange}
            presets={durationSelectorPresets}
            initialPreset={duration}
        />
    );

    return (
        <MarketingWorkspaceFiltersContainer>
            <ResponsiveFiltersBarPro
                isSideBarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
                onSidebarToggle={onSideBarToggle}
                filters={[
                    {
                        id: "country",
                        filter: (
                            <CountryFilter
                                key="country-filter"
                                height={64}
                                availableCountries={availableCountries}
                                changeCountry={onCountryChange}
                                selectedCountryIds={{ [selectedCountryId]: true }}
                                appendTo={"body"}
                                dropdownPopupPlacement="bottom-right"
                            />
                        ),
                        compactFilter: {
                            listItem: (
                                <SidebarListCompactElementItem
                                    key="filter-country"
                                    iconClass={`country-icon country-icon-${selectedCountryId}`}
                                    title={selectedCountryText}
                                />
                            ),
                            compactElement: (
                                <CountryFilterCompact
                                    countries={availableCountries}
                                    onChange={onFiltersSidebarListCompactElementItemChangeProp}
                                    selectedCountry={{ [selectedCountryId]: true }}
                                    onChangeCallBack={onCountryChange}
                                />
                            ),
                        },
                    },
                    {
                        id: "duration",
                        filter: durationSelectorFilter,
                        compactFilter: {
                            listItem: (
                                <DurationSelectorSidebarButton
                                    key="filter-duration"
                                    presets={durationSelectorPresets}
                                    initialPreset={duration}
                                    compareSelected={false}
                                />
                            ),
                            compactElement: (
                                <DurationSelectorCompact
                                    key="filter-duration-compact"
                                    maxDate={maxDate}
                                    minDate={minDate}
                                    presets={durationSelectorPresets}
                                    initialPreset={duration}
                                    componentName={componentId}
                                    keys={""}
                                    onSubmit={onDurationChange}
                                    compareAllowed={false}
                                />
                            ),
                        },
                    },
                    {
                        id: "websource",
                        filter: (
                            <WebSourceFilter
                                key="websource-filter"
                                items={availableWebSources}
                                onChange={onWebSourceChange}
                                selectedIds={{ [selectedWebSource.id]: true }}
                                height={64}
                                appendTo={"body"}
                                dropdownPopupPlacement="bottom-right"
                                disabled={webSourceFilterDisabled}
                            />
                        ),
                        compactFilter: {
                            listItem: (
                                <SidebarListCompactElementItem
                                    key="filter-websource"
                                    iconClass={`icon icon-${selectedWebSource.icon}`}
                                    title={selectedWebSource.text}
                                    disabled={webSourceFilterDisabled}
                                />
                            ),
                            compactElement: (
                                <SidebarListCompactElement key="filter-websource">
                                    {availableWebSources.map((webSource, index) => (
                                        <div key={index} className="WebSourceFilterCompactItem">
                                            <WebSourceDropdownItem
                                                {...webSource}
                                                onClick={onFiltersSidebarListCompactElementItemChangeProp(
                                                    webSource,
                                                    onWebSourceChange,
                                                )}
                                                selected={selectedWebSource.id === webSource.id}
                                                wrapper={ContactUsItemWrap}
                                            />
                                        </div>
                                    ))}
                                </SidebarListCompactElement>
                            ),
                        },
                    },

                    ...(showIncludeSubdomainsFilter
                        ? [
                              {
                                  id: "includeSubDomains",
                                  filter: (
                                      <DropdownFilter
                                          cssClassContainer="include-subdomains-filter"
                                          height={64}
                                          width={188}
                                          items={includeSubdomainsItems}
                                          key="filter-subdomains"
                                          selectedIds={{
                                              [isIncludeSubdomains
                                                  ? ESubdomainsType.INCLUDE
                                                  : ESubdomainsType.EXCLUDE]: true,
                                          }}
                                          onChange={onSubDomainsFilterChange}
                                          disabled={includeSubdomainsDisabled}
                                      />
                                  ),
                                  compactFilter: {
                                      listItem: (
                                          <SidebarListCompactElementItem
                                              key="filter-subdomains"
                                              title={
                                                  includeSubdomainsItems.find(
                                                      (type) => type.selected,
                                                  ).text
                                              }
                                              disabled={includeSubdomainsDisabled}
                                          />
                                      ),
                                      compactElement: (
                                          <SidebarListCompactElement key="filter-websource">
                                              {includeSubdomainsItems.map((type, index) => (
                                                  <div
                                                      key={index}
                                                      className="IncludeSubdomainsFilterCompactItem"
                                                  >
                                                      <SimpleDropdownItem
                                                          onClick={onFiltersSidebarListCompactElementItemChangeProp(
                                                              type,
                                                              onSubDomainsFilterChange,
                                                          )}
                                                          selected={type.selected}
                                                          id={type.id}
                                                      >
                                                          {type.text}
                                                      </SimpleDropdownItem>
                                                  </div>
                                              ))}
                                          </SidebarListCompactElement>
                                      ),
                                  },
                              },
                          ]
                        : []),
                    ...(showKeywordsTypeFilter
                        ? [
                              {
                                  id: "type",
                                  filter: (
                                      <PaidOrganicFilter
                                          websource={
                                              selectedWebSource.id as "Desktop" | "MobileWeb"
                                          }
                                          height={64}
                                          onChange={onKeywordsTypeChange}
                                          selectedIds={{ [selectedKeywordsType]: true }}
                                      />
                                  ),
                                  compactFilter: {
                                      listItem: (
                                          <SidebarListCompactElementItem
                                              key="filter-type"
                                              title={
                                                  getPaidOrganicFilterItems(
                                                      selectedWebSource.id,
                                                  ).find((item) => item.id === selectedKeywordsType)
                                                      .text
                                              }
                                          />
                                      ),
                                      compactElement: (
                                          <SidebarListCompactElement>
                                              {getPaidOrganicFilterItems(selectedWebSource.id).map(
                                                  (type, index) => (
                                                      <div
                                                          key={index}
                                                          className="KeywordsTypeFilterCompactItem"
                                                      >
                                                          <SimpleDropdownItem
                                                              onClick={onFiltersSidebarListCompactElementItemChangeProp(
                                                                  type,
                                                                  onKeywordsTypeChange,
                                                              )}
                                                              selected={
                                                                  type.id === selectedKeywordsType
                                                              }
                                                              id={type.id}
                                                          >
                                                              {type.text}
                                                          </SimpleDropdownItem>
                                                      </div>
                                                  ),
                                              )}
                                          </SidebarListCompactElement>
                                      ),
                                  },
                              },
                          ]
                        : []),
                ]}
                fixedCompactFilters={fixedCompactFilters}
            />
        </MarketingWorkspaceFiltersContainer>
    );
};
