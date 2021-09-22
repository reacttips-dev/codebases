/**
 * Created by Sahar.Rehani on 04/22/2018.
 */

import { Injector } from "common/ioc/Injector";
import { swSettings, SWSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import { PureComponent } from "react";
import { AssetsService } from "services/AssetsService";
import { allTrackers } from "services/track/track";
import AppPerformance from "../../../../../.pro-features/pages/app performance/src/page/AppPerformance";
import { WebsiteTooltip } from "../../../../components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import { DefaultFetchService } from "../../../../services/fetchService";
import CountryService from "services/CountryService";
import { chosenItems } from "common/services/chosenItems";
import { FavoritesService } from "services/favorites/favoritesService";
import { isSalesIntelligenceAppsState } from "pages/sales-intelligence/helpers/helpers";

@SWReactRootComponent
export class AppPerformanceContainer extends PureComponent<any, any> {
    public static defaultProps = {
        showStoreSearchLink: true,
    };

    public fetchService: any;
    public pageFilters: any;
    public swNavigator: any;
    public swSettings: SWSettings;
    public selectedApps: any;
    public isCompare: boolean;
    public data: any;

    constructor(props, context) {
        super(props, context);
        this.fetchService = DefaultFetchService.getInstance();
        this.selectedApps = chosenItems;
        this.swNavigator = Injector.get<any>("swNavigator");
        this.swSettings = swSettings;
        this.pageFilters = this.swNavigator.getApiParams();
        this.isCompare = this.selectedApps.length > 1;
        this.state = {
            loading: true,
            isPropertyTracked: FavoritesService.isCurrentPageFavorite(),
        };
    }

    public componentDidMount() {
        this.fetchAppPerformance();
    }

    public render() {
        const pageFilters = this.getPageFilters();
        return (
            <AppPerformance
                compareMode={this.isCompare}
                loading={this.state.loading}
                pageFilters={pageFilters}
                data={this.data}
                translate={i18nFilter()}
                isPropertyTracked={this.state.isPropertyTracked}
                onAppTrack={this.onAppTrack}
                track={allTrackers.trackEvent.bind(allTrackers)}
                getLink={this.swNavigator.href.bind(this.swNavigator)}
                getAssetsUrl={AssetsService.assetUrl.bind(AssetsService)}
                websiteTooltipComponent={WebsiteTooltip}
                hideStoreSection={pageFilters.country === 156}
                showStoreSearchLink={this.props.showStoreSearchLink}
                swNavigator={this.swNavigator}
            />
        );
    }

    public getPageFilters = () => {
        const currentComponent = this.swSettings.getCurrentComponent();
        return {
            appsInfo: this.selectedApps.map((app) => ({
                icon: app.Icon,
                id: app.Id,
                title: app.Title,
                category: app.Category,
                relatedWebsites: this.getRelatedWebsites(app.RelatedSites),
            })),
            from: this.pageFilters.from,
            to: this.pageFilters.to,
            lastScrapingDate: currentComponent.resources.MobileScrapingDate,
            downloadsDuration: {
                to: this.pageFilters.to,
                from: dayjs
                    .utc(this.pageFilters.to, "YYYY|MM|DD")
                    .add(-5, "M")
                    .format("YYYY|MM|DD"),
            },
            country: this.pageFilters.country,
            countryName: CountryService.getCountryById(this.pageFilters.country).text,
            store: _.capitalize(this.getStore()),
            mainAppId: this.swNavigator.getParams().appId.replace("0_", ""),
        };
    };

    public fetchAppPerformance = async () => {
        const setLoadingFalse = () => this.setState({ loading: false });
        const response = await this.fetchService
            .get(`/api/performancepage/app/overview${this.isCompare ? "Compare" : ""}`, {
                country: this.pageFilters.country,
                appId: this.pageFilters.appId,
                store: this.getStorePrefix(),
            })
            .catch(() => {
                setLoadingFalse();
            });
        this.data = response;
        setLoadingFalse();
    };

    public onAppTrack = () => {
        if (this.state.isPropertyTracked) {
            FavoritesService.removeCurrentPageFromFavorites();
        } else {
            FavoritesService.addCurrentPageToFavorites();
        }
        this.setState({ isPropertyTracked: !this.state.isPropertyTracked });
    };

    public getRelatedWebsites(sites = []) {
        const state = isSalesIntelligenceAppsState(this.swNavigator)
            ? "accountreview_website_overview_websiteperformance"
            : "websites-worldwideOverview";

        const sitesObj = {};
        sites.forEach((item) => {
            sitesObj[item.Url] = {
                icon: item.Favicon,
                href: this.swNavigator.href(state, {
                    key: item.Url,
                    country: this.pageFilters.country,
                    isWWW: "*",
                    duration: "3m",
                }),
            };
        });
        return sitesObj;
    }

    public getStore() {
        return this.pageFilters.store.toLowerCase();
    }

    public getStorePrefix() {
        return this.getStore() === "google" ? "0" : "1";
    }
}
