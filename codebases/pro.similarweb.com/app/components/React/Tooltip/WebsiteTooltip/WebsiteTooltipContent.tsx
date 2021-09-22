/**
 * Created by Sahar.Rehani on 7/29/2016.
 */

import { SWReactCountryIcons } from "@similarweb/icons";
import { InfoCardWebsite } from "@similarweb/ui-components/dist/info-card";
import * as _ from "lodash";
import ngRedux from "ng-redux";
import * as PropTypes from "prop-types";
import * as React from "react";
import { hasInvestorPermission, hasSalesPermission } from "services/Workspaces.service";
import { StyledPrimaryTitle } from "styled components/StyledBoxTitle/src/StyledBoxTitle";
import styled from "styled-components";
import { FlexRow } from "../../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { Injector } from "../../../../../scripts/common/ioc/Injector";
import { SwNavigator } from "../../../../../scripts/common/services/swNavigator";
import { abbrNumberFilter } from "../../../../filters/ngFilters";
import { addSiteToWatchList } from "../../../../pages/workspace/common/actions_creators/common_worksapce_action_creators";
import { isDomainInWorkspace } from "../../../../pages/workspace/common/workspacesUtils";
import { AssetsService } from "../../../../services/AssetsService";
import { TrackWithGuidService } from "../../../../services/track/TrackWithGuidService";
import { InjectableComponentClass } from "../../InjectableComponent/InjectableComponent";
import { TrackButton } from "../../TrackButton/TrackButton";

const CountryFlagContainer = styled.div`
    width: 12px;
    height: 12px;
    margin-right: 5px;
    display: inline-block;
`;

const WebsiteTooltipHeader = styled(FlexRow)`
    justify-content: space-between;
    align-items: center;
    height: 24px;
    h1 {
        flex-grow: 1;
        margin: 0;
        text-align: left;
    }
`;

interface IWebsiteTooltipContentProps {
    domain: string;
    reposition?: () => void;
    hideTrackButton?: boolean;
}

interface IWebsiteTooltipContentState {
    data: any;
    showing: string;
    isTracked: boolean;
    isTrackLoading: boolean;
}

class WebsiteTooltipContentClass extends InjectableComponentClass<
    IWebsiteTooltipContentProps,
    IWebsiteTooltipContentState
> {
    public static propTypes = {
        domain: PropTypes.string,
    };

    public static defaultProps = { domain: null };

    private sitesResource;
    private swNumberFilter;
    private prettifyCategoryFilter;
    private categoryIconFilter;
    private swNavigator;
    private mounted = false;
    private loading = false;
    private hasTrackWorkspaces = false;

    constructor(props) {
        super(props);
        this.sitesResource = this.injector.get("sitesResource");
        this.swNumberFilter = this.injector.get("swNumberFilter");
        this.prettifyCategoryFilter = this.injector.get("prettifyCategoryFilter");
        this.categoryIconFilter = this.injector.get("categoryIconFilter");
        this.swNavigator = Injector.get<SwNavigator>("swNavigator");
        this.state = {
            data: null,
            showing: props.domain,
            isTracked: false,
            isTrackLoading: true,
        };
    }

    public fetchSiteInfo(domain) {
        // don't fetch if still loading
        if (!domain || this.loading) {
            return;
        }
        this.loading = true;
        const { isWWW, country, webSource = "Total" } = this.swNavigator.getParams();
        this.sitesResource.getSiteInfo(
            { keys: domain, webSource, country, mainDomainOnly: isWWW === "*" ? true : false },
            (data) => {
                // verify the correct request
                if (this.state.showing === domain && this.mounted) {
                    this.loading = false;
                    // set state and reposition
                    this.setState({ data: data[domain] }, () => this.props.reposition());
                }
            },
        );
    }

    public async componentDidMount() {
        this.fetchSiteInfo(this.props.domain);
        this.mounted = true;
        isDomainInWorkspace(this.props.domain)
            .then(({ hasLists, isTracked }) => {
                this.hasTrackWorkspaces = hasLists;
                if (this.mounted) {
                    this.setState({ isTracked, isTrackLoading: false });
                }
            })
            .catch(() => {
                if (this.mounted) {
                    this.setState({ isTrackLoading: false });
                }
            });
    }

    public componentWillUnmount() {
        this.setState({ data: null, showing: null });
        this.mounted = false;
    }

    public componentDidUpdate(prevProps) {
        if (this.props.domain !== prevProps.domain) {
            this.fetchSiteInfo(this.props.domain);
        }
    }

    public getLoadingElements() {
        return (
            <div
                className="popup-content--loading"
                dangerouslySetInnerHTML={{ __html: this.i18n("website.tooltip.loading") }}
            />
        );
    }

    public onClickTrackButton = async () => {
        const store = Injector.get<ngRedux.INgRedux>("$ngRedux");
        store.dispatch<any>(addSiteToWatchList(this.props.domain));
        TrackWithGuidService.trackWithGuid("common.info-card.track", "click", {
            websiteName: this.state.data.displayName,
        });
    };

    public getImageSrc = (data) => {
        if (data.category === "Adult") {
            return AssetsService.assetUrl("/images/new-adult-large.png");
        } else {
            return data.image || AssetsService.assetUrl("/images/new-no-image.png");
        }
    };

    public getTrackButton = () => {
        return hasSalesPermission() || hasInvestorPermission() ? (
            <TrackButton
                isTracked={this.state.isTracked}
                isLoading={this.state.isTrackLoading}
                isDisabled={this.state.isTrackLoading || this.state.isTracked}
                onClick={this.onClickTrackButton}
                text={this.state.isTracked ? "wa.ao.header.tracked" : "wa.ao.header.track"}
            />
        ) : null;
    };

    public getTrackingForWebsite = () => {
        TrackWithGuidService.trackWithGuid("common.info-card.website-link", "click", {
            websiteName: this.state.data.displayName,
        });
    };

    public getSiteInfoElement(data) {
        const { webSource = "Total" } = this.swNavigator.getParams();
        data = data || {};
        const isLoadingData = _.isEmpty(data);
        if (isLoadingData) {
            return <InfoCardWebsite isLoadingData={true} />;
        } else {
            return (
                <InfoCardWebsite
                    width={394}
                    isLoadingData={false}
                    Button={this.getTrackButton()}
                    icon={data.icon ? data.icon : "/images/autocomplete-default.png"}
                    imgSrc={this.getImageSrc(data)}
                    category={this.prettifyCategoryFilter(data.category)}
                    websiteName={data.displayName}
                    countryId={data.highestTrafficCountry.id}
                    description={
                        data.description === ""
                            ? this.i18n("infotip.description.undefined")
                            : data.description
                    }
                    globalRankingLabel={this.i18n("infotip.global")}
                    globalRanking={
                        data.globalRanking === 0 ? "-" : abbrNumberFilter()(data.globalRanking)
                    }
                    highestTrafficCountryRankingLabel={this.i18n("infotip.country")}
                    highestTrafficCountryRanking={
                        data.highestTrafficCountryRanking === 0
                            ? "-"
                            : abbrNumberFilter()(data.highestTrafficCountryRanking)
                    }
                    foundedLabel={this.i18n("infotip.website.founded")}
                    foundedValue={data.yearFounded}
                    monthlyVisits={
                        data.monthlyVisits === 0 ? "-" : abbrNumberFilter()(data.monthlyVisits)
                    }
                    monthlyVisitsLabel={this.i18n("infotip.monthlyVisits")}
                    employees={data.employeeRange}
                    countryOfVisits={data.country}
                    platform={
                        webSource === "Desktop"
                            ? "desktop"
                            : webSource === "MobileWeb"
                            ? "mobile-web"
                            : "combined"
                    }
                    websiteLinkTracking={this.getTrackingForWebsite}
                />
            );
        }
    }

    public render() {
        return (
            <div className="swWebsiteInfoTip">
                <div className="swWebsiteInfoTip-inner">
                    {this.getSiteInfoElement(this.state.data)}
                </div>
            </div>
        );
    }
}
export const WebsiteTooltipContent = WebsiteTooltipContentClass;
