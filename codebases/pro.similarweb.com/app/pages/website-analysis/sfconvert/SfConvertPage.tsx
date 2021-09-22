/* eslint-disable @typescript-eslint/camelcase */
import * as utils from "components/filters-bar/utils";
import { commonWebSources } from "components/filters-bar/utils";
import { ISimilarSite } from "components/Workspace/Wizard/src/types";
import dayjs from "dayjs";
import React, { useEffect, useReducer, useState } from "react";
import CountryService, { ICountryService } from "services/CountryService";
import { DefaultFetchService } from "services/fetchService";
import SalesWorkspaceApiService from "services/workspaces/salesWorkspaceApiService";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { RootState, ThunkDispatchCommon } from "store/types";
import { fetchDataForRightBarThunkAction } from "pages/workspace/sales/sub-modules/common/store/effects";
import { Wrapper } from "./style";
import { selectSiteInfoFavicon } from "pages/workspace/sales/sub-modules/feed/store/selectors";
import withLegacyWorkspacesFetch from "pages/sales-intelligence/hoc/withLegacyWorkspacesFetch";
import { AuthorizedPage } from "./components/AuthorizedPage";
import { BlockedPage } from "./components/BlockedPage";
import { selectLegacyWorkspacesFetching } from "pages/sales-intelligence/sub-modules/common/store/selectors";

export interface ISFConvertState {
    country: number;
    duration: string;
    site: string;
    siteInfo: any;
    competitors: ISimilarSite[];
    snapshotFirstAvailableDate: string;
    snapshotLastAvailableDate: string;
    windowStartDate: string;
    windowEndDate: string;
    webAnalysisComponent: any;
    webSource: "total" | "desktop" | "mobileWeb";
    countryService: ICountryService;
    countries: any[];
}

const formatDate = (date) => dayjs.utc(date).format("yyyy-MM-dd");

export const sfConvertPageContext = React.createContext<ISFConvertState>(null);
export const CHANGE_COMPETITORS = "CHANGE_COMPETITORS";
export const CHANGE_SITE_INFO = "CHANGE_SITE_INFO";
export const CHANGE_COUNTRY = "CHANGE_COUNTRY";

function reducer(state, action): ISFConvertState {
    switch (action.type) {
        case CHANGE_COMPETITORS:
            return {
                ...state,
                competitors: action.competitors,
            };
        case CHANGE_SITE_INFO:
            return {
                ...state,
                siteInfo: action.siteInfo,
            };
        case CHANGE_COUNTRY:
            return {
                ...state,
                country: action.country.id,
                webSource: action.country.mobileWeb
                    ? commonWebSources.total().id
                    : commonWebSources.desktop().id,
            };
        default:
            throw new Error("action type is not defined");
    }
}

const getCountryObjById = (countryId) => {
    const countries = utils.getCountries(true);
    const selectedCountryObj = countries.find((country) => {
        return country.id.toString() === countryId.toString();
    });
    return selectedCountryObj;
};

export function SfConvertPageComponent({
    swSettings,
    swNavigator,
    fetchDataForRightBar,
    favIcon,
    workspaceFetching,
}: SfConvertProps & {
    swSettings: Record<string, any>;
    swNavigator: Record<string, any>;
}) {
    const [isLoading, setIsLoading] = useState(workspaceFetching);

    const webAnalysisComponent = swSettings.components.WebAnalysis;
    const fetchService = DefaultFetchService.getInstance();
    const { country, duration } = webAnalysisComponent.defaultParams;
    const [sfConvertPageState, dispatch] = useReducer(reducer, getInitialState());
    // Init service to get workspaceId and getExcelTableRowHref
    const workspaceService = new SalesWorkspaceApiService();
    const getExcelTableRowHref = workspaceService.getExcelTableRowHref;

    useEffect(() => {
        if (!workspaceFetching) {
            fetchDataForRightBar(sfConvertPageState?.site, null, country);
        }
    }, [workspaceFetching]);

    function getInitialState(): ISFConvertState {
        return {
            country,
            duration,
            site: swNavigator.getParams()?.key,
            siteInfo: {},
            competitors: [],
            webSource: getCountryObjById(country)?.mobileWeb
                ? commonWebSources.total()?.id
                : commonWebSources.desktop()?.id,
            webAnalysisComponent,
            snapshotFirstAvailableDate: formatDate(
                webAnalysisComponent?.resources?.SnapshotInterval?.startdate,
            ),
            snapshotLastAvailableDate: formatDate(
                webAnalysisComponent?.resources?.SnapshotInterval?.enddate,
            ),
            countryService: CountryService,
            windowStartDate: formatDate(webAnalysisComponent?.resources?.WindowInterval?.startdate),
            windowEndDate: formatDate(webAnalysisComponent?.resources?.WindowInterval?.enddate),
            countries: utils.getCountries(true),
        } as ISFConvertState;
    }

    const hasNoData = () => {
        return !sfConvertPageState.siteInfo.monthlyVisits;
    };

    useEffect(
        /* fetch competitors */ () => {
            async function fetchCompetitors() {
                const competitors = await fetchService.get(
                    `/api/WebsiteOverview/getsimilarsites?key=${sfConvertPageState.site}&limit=3`,
                );
                dispatch({ type: CHANGE_COMPETITORS, competitors });
            }

            fetchCompetitors();
        },
        [sfConvertPageState.site],
    );

    useEffect(
        /* fetch site info */ () => {
            async function fetchSiteInfo() {
                setIsLoading(true);
                const { site } = sfConvertPageState;
                const res = await fetchService.get(
                    `/api/WebsiteOverview/getheader?includeCrossData=true&keys=${site}&mainDomainOnly=true`,
                );
                setIsLoading(false);
                dispatch({ type: CHANGE_SITE_INFO, siteInfo: res[site] });
            }

            fetchSiteInfo();
        },
        [sfConvertPageState.site],
    );

    const isFroUser = swSettings.user.isFro;

    return (
        <sfConvertPageContext.Provider value={sfConvertPageState}>
            {!workspaceFetching && (
                <Wrapper>
                    {isFroUser ? (
                        <BlockedPage swSettings={swSettings} />
                    ) : (
                        <AuthorizedPage
                            hasNoData={hasNoData}
                            isLoading={isLoading}
                            domain={sfConvertPageState.site}
                            favIcon={favIcon}
                            getExcelTableRowHref={getExcelTableRowHref}
                        />
                    )}
                </Wrapper>
            )}
        </sfConvertPageContext.Provider>
    );
}

const mapDispatchToProps = (dispatch: ThunkDispatchCommon) => {
    return bindActionCreators(
        {
            fetchDataForRightBar: fetchDataForRightBarThunkAction,
        },
        dispatch,
    );
};

const mapStateToProps = (state: RootState) => ({
    favIcon: selectSiteInfoFavicon(state),
    workspaceFetching: selectLegacyWorkspacesFetching(state),
});

export type SfConvertProps = ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps>;

export const SfConvertPage = compose(
    withLegacyWorkspacesFetch,
    connect(mapStateToProps, mapDispatchToProps) as React.FC<SfConvertProps>,
)(SfConvertPageComponent) as React.FC<{
    swSettings: Record<string, any>;
    swNavigator: Record<string, any>;
}>;
