import { SearchInput } from "@similarweb/ui-components/dist/search-input";
import { SearchContainer } from "pages/workspace/StyledComponent";
import { ReactNode } from "react";
import * as React from "react";
import { connect } from "react-redux";
import DurationService from "services/DurationService";
import styled from "styled-components";
import { colorsPalettes, rgba, mixins } from "@similarweb/styles";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { CHART_COLORS } from "constants/ChartColors";
import { i18nFilter } from "filters/ngFilters";
import { DefaultFetchService, NoCacheHeaders } from "services/fetchService";
import {
    IMarketingWorkspaceTotalTrafficShareProps,
    MarketingWorkspaceTotalTrafficShare,
} from "../../../workspace/marketing/shared/MarketingWorkspaceTotalTrafficShare";
import { Button, ButtonPillOutlined } from "@similarweb/ui-components/dist/button";
import { SWReactIcons } from "@similarweb/icons";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { IAccountUser } from "sharing/SharingService";

interface IMonitorKeywordsTableTopBarProps {
    onFilterChange: (any, boolean) => void;
    isLoadingData?: boolean;
    country: number;
    options: ReactNode;
    duration: string;
    websource: string;
    sites?: string[];
    Keys?: string[];
    isWWW?: string;
    filtersStateObject: any;
    keywordsType: string;
    endpoint: string;
    permissionsComponent: string;
    searchPlaceholder: string;
    totalTrafficTitle: string;
    tooltipTitle: string;
    onClickRecommended?: VoidFunction;
    isRecommendationLoading: boolean;
    recommendationNumber: number;
    isKeywordGroupSharedWithMe?: boolean;
    KeywordsGroup: any;
    GroupId: any;
    isPartnerPage?: boolean;
}

interface IMonitorKeywordsTableTopBarState {
    search: string;
    // data for total traffic component
    totalTrafficDisplayType: string;
    totalTrafficData?: Pick<IMarketingWorkspaceTotalTrafficShareProps, "data">;
    totalTrafficLoading: boolean;
    user?: IAccountUser;
}
const ButtonPillOutlinedStyled = styled(ButtonPillOutlined)`
    min-width: 12px;
`;

const MonitorKeywordsTableTopBarContainer = styled.div`
    display: flex;
    align-items: center;
    ${SearchContainer} {
        flex-grow: 1;
    }
`;

const Right = styled.div`
    flex-grow: 0;
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

const SearchContainerWrapper = styled(SearchContainer)<{ hideBorder: boolean }>`
    padding-right: 16px;
    border-top-width: ${({ hideBorder }) => (hideBorder ? 0 : 1)};
`;

const SharedBy = styled(FlexRow)`
    margin-right: 8px;
    align-items: center;
    ${mixins.setFont({ $color: rgba(colorsPalettes.carbon[500], 0.6), $size: 14 })};
    ${SWReactIcons} {
        margin-right: 9px;
        path {
            fill: ${rgba(colorsPalettes.carbon[500], 0.6)};
        }
    }
`;

const i18n = i18nFilter();

class MonitorKeywordsTableTopBar extends React.Component<
    IMonitorKeywordsTableTopBarProps,
    IMonitorKeywordsTableTopBarState
> {
    private readonly fetchService = DefaultFetchService.getInstance();
    private timeoutId: number;

    constructor(props, context) {
        super(props, context);
        this.state = {
            search: null,
            totalTrafficLoading: false,
            totalTrafficDisplayType: "percent",
        };
    }

    public componentDidUpdate(prevProps) {
        ["country", "duration", "sites", "Keys", "websource", "keywordsType", "isWWW"].forEach(
            (prop) => {
                if (prevProps[prop] !== this.props[prop]) {
                    this.filterChange(this.props);
                }
            },
        );
        if (this.props.Keys && !this.state.totalTrafficData && !this.state.totalTrafficLoading) {
            this.filterChange(this.props);
        }
    }

    public render() {
        return (
            <div>
                {this.props.Keys && (
                    <div style={{ marginTop: 24, marginBottom: 27, padding: "0 16px" }}>
                        {this.state.totalTrafficData && (
                            <MarketingWorkspaceTotalTrafficShare
                                title={this.props.totalTrafficTitle}
                                data={
                                    this.state.totalTrafficData && this.state.totalTrafficData.data
                                }
                                loading={this.state.totalTrafficLoading}
                                setDisplayType={this.setDisplayType}
                                displayType={this.state.totalTrafficDisplayType}
                                tooltipTitle={this.props.tooltipTitle}
                            />
                        )}
                    </div>
                )}
                <MonitorKeywordsTableTopBarContainer>
                    <SearchContainerWrapper hideBorder={!this.props.Keys}>
                        <SearchInput
                            defaultValue={this.state.search}
                            debounce={400}
                            onChange={this.onSearch}
                            placeholder={i18nFilter()(this.props.searchPlaceholder)}
                        />
                        <Right>
                            {this.props.onClickRecommended && (
                                <Button
                                    type="outlined"
                                    label="recommended keywords"
                                    onClick={this.props.onClickRecommended}
                                >
                                    {this.props.isRecommendationLoading ? (
                                        <div style={{ padding: "0 0 0 10px" }}>
                                            <DotsLoader dotWidth={3} multiplier={0.5} />{" "}
                                        </div>
                                    ) : (
                                        <ButtonPillOutlinedStyled>
                                            {" "}
                                            {this.props.recommendationNumber}
                                        </ButtonPillOutlinedStyled>
                                    )}
                                </Button>
                            )}
                            {this.state.user && (
                                <SharedBy>
                                    <SWReactIcons iconName="users" size="sm" />
                                    {i18n("keyword.groups.sharing.sharedby", {
                                        name: `${this.state.user.FirstName} ${this.state.user.LastName}`,
                                    })}
                                </SharedBy>
                            )}
                            {this.props.options}
                        </Right>
                    </SearchContainerWrapper>
                </MonitorKeywordsTableTopBarContainer>
            </div>
        );
    }

    // check whether a prop from the table current filters has changed
    private isPropChanged = (propName, propValue) => {
        if (this.props.filtersStateObject.hasOwnProperty(propName)) {
            return this.props.filtersStateObject[propName] !== propValue;
        } else {
            return typeof propValue !== "undefined" && propValue !== null;
        }
    };

    private onMoreDropdownButtonToggle = (isOpen) => {
        //todo tracking?
    };

    private onSearch = (search) => {
        this.props.onFilterChange({ filter: search }, false);
        this.setState({ search });
    };

    private filterChange = (filters) => {
        let newFilters: any = {};
        if (this.isPropChanged("country", filters.country)) {
            newFilters = {
                ...newFilters,
                country: filters.country,
            };
        }
        if (this.isPropChanged("duration", filters.duration)) {
            const { from, to, isWindow } = this.getDurationForApi(filters.duration);
            newFilters = {
                ...newFilters,
                from,
                to,
                isWindow,
            };
        }
        if (this.isPropChanged("websource", filters.websource)) {
            newFilters = {
                ...newFilters,
                websource: filters.websource,
            };
        }
        if (this.isPropChanged("Keys", filters.Keys)) {
            newFilters = {
                ...newFilters,
                Keys: filters.Keys,
            };
        }
        if (this.isPropChanged("keywordsType", filters.keywordsType)) {
            newFilters = {
                ...newFilters,
                keywordsType: filters.keywordsType,
            };
        }
        if (this.isPropChanged("isWWW", filters.isWWW)) {
            newFilters = {
                ...newFilters,
                includeSubDomains: filters.isWWW === "*",
            };
        }

        this.props.onFilterChange(newFilters, false);
        if (filters.Keys) {
            this.fetchTotalTrafficData();
        }
    };

    private getDurationForApi = (duration) => {
        const { from, to, isWindow } = DurationService.getDurationData(
            duration,
            "",
            this.props.permissionsComponent,
        ).forAPI;
        return { from, to, isWindow };
    };

    private getTotalTrafficEndProps = () => {
        const {
            country,
            duration,
            keywordsType,
            websource,
            endpoint,
            isWWW,
            GroupId,
            isPartnerPage,
        } = this.props;
        const { from, to, isWindow } = this.getDurationForApi(duration);
        const sites = Array.isArray(this.props.Keys) ? this.props.Keys.join(",") : this.props.Keys;
        const params = {
            KeywordSource: keywordsType,
            country,
            Keys: isPartnerPage ? null : sites,
            Sites: isPartnerPage ? sites : null,
            from,
            to,
            isWindow,
            websource,
            includeSubDomains: isWWW === "*",
            keywordGroupId: isPartnerPage ? GroupId : null,
        };
        // remove null or undefined values from the params object
        Object.entries(params).forEach(([paramKey, ParamValue]) => {
            if (ParamValue === null || typeof ParamValue === "undefined") {
                delete params[paramKey];
            }
        });
        return {
            endpoint,
            params,
            headers: NoCacheHeaders,
        };
    };

    private fetchTotalTrafficData = async () => {
        const isPartnerPage = this.props.isPartnerPage;
        await this.setStateAsync({
            totalTrafficLoading: true,
        });
        const { endpoint, params, headers } = this.getTotalTrafficEndProps();
        const data = await this.fetchService.get<any>(endpoint, params, { headers });
        if (isPartnerPage) {
            if (data.visits) {
                this.setState({
                    totalTrafficData: {
                        data: {
                            bars: this.Split(data),
                            total: data.visits,
                            change: data.change,
                        },
                    },
                    totalTrafficLoading: false,
                });
            }
        } else {
            if (data.header.visits) {
                data.trafficDistribution = data.data.map((site) => {
                    return {
                        site: site.site,
                        value: site.value,
                        percentage: site.percentage,
                    };
                });
                this.setState({
                    totalTrafficData: {
                        data: {
                            bars: this.Split(data),
                            total: data.header.visits,
                            change: data.header.change,
                        },
                    },
                    totalTrafficLoading: false,
                });
            }
        }
    };

    private Split = (data) => {
        return data.trafficDistribution.map(({ site, percentage, value }, index) => {
            return {
                color: CHART_COLORS.main[index],
                name: site,
                value,
                percentage,
                width: percentage * 100,
            };
        });
    };

    private setDisplayType = (displayType) => {
        this.setState({
            totalTrafficDisplayType: displayType,
        });
    };

    private setStateAsync(newState) {
        return new Promise<void>((resolve, reject) => {
            this.setState(newState, resolve);
        });
    }
}

const mapStateToProps = ({ routing }) => {
    let GroupId;
    const { GroupId: keywordGroupId, country, duration, websource, isWWW, sites } = routing.params;
    const isPartnerPage = !GroupId;
    let endpoint = `widgetApi/KeywordGroup/KeywordGroupBenchmarkOverview/Table`;
    if (isPartnerPage) {
        (GroupId = routing.params.partnerListId),
            (endpoint = `api/MonitorPartnerList/${GroupId}/benchmark/overview`);
    }

    return {
        country,
        duration,
        websource,
        endpoint,
        isWWW,
        Keys: sites,
        GroupId: keywordGroupId,
        isPartnerPage,
    };
};

export default connect(mapStateToProps, null, null, {
    areStatesEqual: (next, prev) => {
        const sites = next.routing.params.sites;
        if (!sites) {
            return true;
        } else {
            return next === prev;
        }
    },
})(MonitorKeywordsTableTopBar);
