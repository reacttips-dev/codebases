import { Injector } from "common/ioc/Injector";
import { preparePresets } from "components/dashboard/widget-wizard/components/DashboardWizardDuration";
import * as utils from "components/filters-bar/utils";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { MarketingWorkspaceFilters } from "pages/workspace/marketing/shared/MarketingWorkspaceFilters";
import { MarketingWorkspaceOverviewPageHeaderPart } from "pages/workspace/marketing/shared/styledComponents";
import { default as React } from "react";
import { connect } from "react-redux";
import CountryService, { ICountryObject } from "services/CountryService";
import { swSettings } from "common/services/swSettings";

export const MonitorKeywordsFiltersInner = (props) => {
    const swNavigator = Injector.get<any>("swNavigator");
    const { keywordsType, country, duration, webSource, sites, isWWW } = props.params;
    const countryObject: ICountryObject = CountryService.getCountryById(country);
    const minDate = swSettings.current.startDate;
    const maxDate = swSettings.current.endDate;
    const durationSelectorPresets = swSettings.current.datePickerPresets;

    const getAvailableCountries = () => {
        return utils.getCountries();
    };

    const onChangeCountry = (country) => {
        swNavigator.updateParams({ country: country.id });
    };

    const getWebsources = (selectedDuration?) => {
        const correntDuration = selectedDuration ? selectedDuration : duration;
        return utils.getAvailableWebSource(
            { name: "websites-trafficSearch-keywords" },
            { correntDuration, country },
        );
    };

    const onDurationChange = (duration) => {
        swNavigator.updateParams({ duration });
    };

    const onWebSourceChange = (websource) => {
        if (websource.id === "MobileWeb") {
            swNavigator.updateParams({ keywordsType: "organic", webSource: websource.id });
        } else {
            swNavigator.updateParams({ webSource: websource.id });
        }
    };

    const onKeywordsTypeChange = (item) => {
        swNavigator.updateParams({ keywordsType: item.id });
    };

    const onSubDomainsFilterChange = ({ id }) => {
        swNavigator.updateParams({ isWWW: "-" });
    };
    const availableWebSources = getWebsources();
    const selectedWebSource = availableWebSources.find((w) => w.id === webSource);
    const benchmarkToArena = sites && sites.length > 0;

    return (
        <div>
            <MarketingWorkspaceOverviewPageHeaderPart className="react-filters-container">
                <MarketingWorkspaceFilters
                    selectedCountryId={countryObject.id}
                    selectedCountryText={countryObject.text}
                    availableCountries={getAvailableCountries()}
                    onCountryChange={onChangeCountry}
                    onDurationChange={onDurationChange}
                    maxDate={maxDate}
                    minDate={minDate}
                    durationSelectorPresets={preparePresets(durationSelectorPresets)}
                    duration={duration}
                    componentId={swSettings.current.componentId}
                    availableWebSources={availableWebSources}
                    selectedWebSource={selectedWebSource}
                    onWebSourceChange={onWebSourceChange}
                    showKeywordsTypeFilter={true}
                    onKeywordsTypeChange={onKeywordsTypeChange}
                    selectedKeywordsType={keywordsType}
                    showIncludeSubdomainsFilter={benchmarkToArena}
                    isIncludeSubdomains={isWWW === "*"}
                    onSubDomainsFilterChange={onSubDomainsFilterChange}
                />
            </MarketingWorkspaceOverviewPageHeaderPart>
        </div>
    );
};

const mapStateToProps = ({ routing }) => {
    return {
        params: routing.params,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

const connected = connect(mapStateToProps, mapDispatchToProps)(MonitorKeywordsFiltersInner);

export default SWReactRootComponent(connected, "MonitorKeywordsFilters");
