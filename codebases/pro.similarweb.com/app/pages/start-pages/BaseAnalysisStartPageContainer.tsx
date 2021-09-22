/**
 * Created by Sahar.Rehani on 05/30/2018.
 */

import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import * as React from "react";
import { PureComponent } from "react";
import DurationService from "services/DurationService";
import {
    getRecentByType,
    getSavedProperties,
} from "../../../.pro-features/pages/module start page/src/utils";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";
import { DefaultFetchService } from "../../services/fetchService";
import { fetchSavedProperties } from "../research-homepage/pageResources";
import * as _ from "lodash";
import CountryService from "services/CountryService";
import { RecentService } from "services/recent/recentService";

export const transformRecentAnalysis = (recents, countryService, swNavigator, i18n) => {
    return recents.map((item) => {
        const pageState = swNavigator.getStateForPageId(item.data.pageId);
        if (!pageState) {
            return { ...item, subtitle: "" };
        }
        const countryCode =
            item.data.country ||
            (_.isFunction(pageState.configId)
                ? swSettings.components[pageState.configId()].defaultParams.country
                : swSettings.components[pageState.configId].defaultParams.country);
        return {
            ...item,
            subtitle: `${i18n(pageState.pageTitle)}, ${
                countryService.countriesById[countryCode].text
            },
         ${DurationService.getDurationData(item.data.duration, null).forWidget}`,
        };
    });
};

export default abstract class BaseAnalysisStartPageContainer extends PureComponent<any, any> {
    public fetchService: any;
    public swNavigator: any;
    public countryService: any;
    public durationService: any;
    public swSettings: any;
    public i18n: any;
    public type: string;
    public recents: any;
    public savedProperties: any;

    constructor(props, context) {
        super(props, context);
        this.fetchService = DefaultFetchService.getInstance();
        this.swNavigator = Injector.get<any>("swNavigator");
        this.countryService = CountryService;
        this.durationService = DurationService;
        this.swSettings = swSettings;
        this.i18n = Injector.get<any>("i18nFilter");
        this.recents = {};
        this.savedProperties = {};
        this.state = {
            autocompleteLoading: false,
            autocompleteFocused: false,
            loading: true,
            empty: {
                saved: false,
                recents: false,
                kwGroups: false,
            },
        };
    }

    public async componentDidMount() {
        const savedPropertiesCall = fetchSavedProperties();
        const recentsResults = RecentService.getRecents();

        const [savedPropertiesResults] = [await savedPropertiesCall];

        const savedProperties = savedPropertiesResults.payload;

        const recents = getRecentByType(recentsResults, this.type);

        this.recents = transformRecentAnalysis(
            recents,
            this.countryService,
            this.swNavigator,
            this.i18n,
        );
        this.savedProperties = getSavedProperties(savedProperties, this.type);
        this.setState((state) => ({
            loading: false,
            empty: {
                saved: !(this.savedProperties.length > 0),
                recents: !(this.recents.length > 0),
            },
        }));
    }

    public abstract getAnalysisType();
    public abstract render();

    public onAutocompleteBlur = (query) => {
        this.setState((state) => ({
            autocompleteFocused: false,
        }));
    };

    public onAutocompleteFocus = () => {
        this.setState((state) => ({
            autocompleteFocused: true,
        }));
    };

    public onAutocompleteItemClick = (url) => () => {
        window.location.href = url;
    };
}

SWReactRootComponent(BaseAnalysisStartPageContainer, "BaseAnalysisStartPageContainer");
