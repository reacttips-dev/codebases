import React from "react";
import { connect } from "react-redux";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import PageTitle from "components/React/PageTitle/PageTitle";
import { SubNav } from "components/sub-navigation-bar/SubNav";
import WebsiteQueryBar from "components/compare/WebsiteQueryBar";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import SubNavBackButton from "components/sub-navigation-bar/SubNavBackButton";
import WebsiteAnalysisFilters from "pages/website-analysis/WebsiteAnalysisFilters";
import { FaviconButtonStyle } from "components/compare/StyledComponent";
import AddWebsiteToListButtonContainer from "./AddToListButton/AddWebsiteToListButtonContainer";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import { selectAllUniqueWebsites } from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import { RootState } from "store/types";
import { StarButtonStyle } from "components/React/FavIcon/FaviconButton";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import OutOfLimitModal from "pages/sales-intelligence/common-components/modals/OutOfLimitModal/OutOfModalLimit";
import { i18nFilter } from "filters/ngFilters";
import { EducationContainer } from "components/educationbar/educationContainer";
import { PreferencesService } from "services/preferences/preferencesService";
import { EDUCATION_BAR_PREFERENCES_KEY } from "components/educationbar/educationHook";

const translate = i18nFilter();

interface IWebsiteAnalysisSubNavState {
    numberOfComparedItems?: number;
    showModalQuota: boolean;
    hideEducationBar?: boolean;
}

class SalesWebsiteAnalysisSubNav extends React.PureComponent<any, IWebsiteAnalysisSubNavState> {
    private services;

    constructor(props, context) {
        super(props, context);
        this.services = {
            chosenSites: Injector.get<any>("chosenSites"),
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
        };
        this.getState = this.getState.bind(this);
        this.renderAddWebsiteToListButton = this.renderAddWebsiteToListButton.bind(this);
        this.state = this.getState();
    }

    renderAddWebsiteToListButton(domain: string) {
        return (
            <FaviconButtonStyle>
                <AddWebsiteToListButtonContainer domain={domain} />
            </FaviconButtonStyle>
        );
    }

    renderButtonOutQuota = () => {
        return (
            <FaviconButtonStyle>
                <PlainTooltip
                    placement="bottom"
                    cssClass="plainTooltip-element PlainTooltip--favoritesStar favorites"
                    tooltipContent={translate("si.pages.account_review.add_to_list_button.tooltip")}
                >
                    <StarButtonStyle>
                        <IconButton
                            type="flat"
                            onClick={() => this.setState({ showModalQuota: true })}
                            dataAutomation="add-website-to-static-list-button"
                            iconName={"star-outline"}
                        />
                    </StarButtonStyle>
                </PlainTooltip>
            </FaviconButtonStyle>
        );
    };

    onCloseModalQuota = () => this.setState({ showModalQuota: false });
    onEducationIconClick = () => {
        PreferencesService.add({ [EDUCATION_BAR_PREFERENCES_KEY]: false });
        this.setState({ hideEducationBar: false });
    };
    onCloseEducationBar = () => {
        PreferencesService.add({ [EDUCATION_BAR_PREFERENCES_KEY]: true });
        this.setState({ hideEducationBar: true });
    };

    public render() {
        const { showModalQuota } = this.state;
        const { usedLeadsLimit } = this.props;
        const quotaLimit = useSalesSettingsHelper().getQuotaLimit();
        const leftQuota = quotaLimit - usedLeadsLimit;
        const pageStateObj = this.services.swNavigator.current();
        const backStateUrl = this.services.swNavigator.href(pageStateObj.homeState, null);

        if (pageStateObj.name === "websites_root-home") {
            return null;
        } else if (pageStateObj.getSubNav) {
            const { numberOfComparedItems } = this.state;

            return pageStateObj.getSubNav(numberOfComparedItems, backStateUrl);
        }
        const renderButton =
            leftQuota <= 0 ? this.renderButtonOutQuota : this.renderAddWebsiteToListButton;

        return (
            <>
                <SubNav
                    backButton={<SubNavBackButton backStateUrl={backStateUrl} />}
                    topLeftComponent={<WebsiteQueryBar renderFavoriteButton={renderButton} />}
                    numberOfComparedItems={this.state.numberOfComparedItems}
                    bottomRightComponent={<WebsiteAnalysisFilters />}
                    bottomLeftComponent={
                        <PageTitle
                            showEducationIcon={this.state.hideEducationBar}
                            onEducationIconClick={this.onEducationIconClick}
                        />
                    }
                    education={
                        !this.state.hideEducationBar && (
                            <EducationContainer
                                onCloseEducationComponent={this.onCloseEducationBar}
                            />
                        )
                    }
                />
                <OutOfLimitModal
                    title={translate("You’ve reached your accounts limit")}
                    contentText={translate(`You’re tracking ${quotaLimit} out of ${quotaLimit} accounts (subscription limit).
                        Consider removing irrelevant domains from your account lists`)}
                    onClose={this.onCloseModalQuota}
                    isOpen={showModalQuota}
                />
            </>
        );
    }

    private getState() {
        return {
            numberOfComparedItems: this.services.chosenSites.get().length,
            showModalQuota: false,
            hideEducationBar: PreferencesService.get(EDUCATION_BAR_PREFERENCES_KEY) || false,
        };
    }
}

function mapStateToProps(state: RootState) {
    return {
        routing: state.routing,
        usedLeadsLimit: selectAllUniqueWebsites(state).length,
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps, undefined)(SalesWebsiteAnalysisSubNav),
    "SalesWebsiteAnalysisSubNav",
);
