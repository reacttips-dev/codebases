import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import React from "react";
import { connect } from "react-redux";
import { RecommendedWebsiteGroupBanner } from "../../../../.pro-features/components/WebsiteRecommendationEngine/src/RecommendedWebsiteGroupBanner";
import { PreferencesService } from "services/preferences/preferencesService";

const i18n = i18nFilter();

export interface IBannerProps {
    currentPage?: string;
    selectedTab?: string;
    displayInPage?: string;
    displayInTab?: string;
    userDataBannerKey?: string;
    displayShowMore?: boolean;
    text: string;
    title: string;
}

const InfoBannerInner: React.FunctionComponent<IBannerProps> = (props) => {
    const {
        currentPage,
        selectedTab,
        displayInPage,
        displayInTab,
        userDataBannerKey,
        displayShowMore,
        text,
        title,
    } = props;
    const isCurrentPage = () => {
        return displayInPage.includes(currentPage);
    };
    if (
        (displayInPage && !isCurrentPage()) ||
        (displayInTab && selectedTab !== displayInTab) ||
        (!displayInPage && !displayInTab)
    ) {
        return null;
    }
    const hideBannerUserPreference =
        userDataBannerKey && (PreferencesService.get(userDataBannerKey) || false);
    const [hideBanner, setHideBanner] = React.useState(hideBannerUserPreference);
    const onCloseClick = () => {
        setHideBanner(true);
        userDataBannerKey && PreferencesService.add({ [userDataBannerKey]: true });
    };
    return (
        !hideBanner && (
            <RecommendedWebsiteGroupBanner
                onCloseClick={onCloseClick}
                title={i18n(title)}
                text={i18n(text)}
                displayShowMore={displayShowMore ? displayShowMore : false}
                containerPadding={"0px 36px 0px 16px"}
            />
        )
    );
};

const mapStateToProps = ({ routing }, ownProps) => {
    return {
        currentPage: routing.currentPage,
        selectedTab: routing.params.selectedTab,
        displayInPage: ownProps.displayInPage,
        displayInTab: ownProps.displayInTab,
        userDataBannerKey: ownProps.userDataBannerKey,
        text: ownProps.text,
        title: ownProps.title,
        displayShowMore: ownProps.displayShowMore,
    };
};

export const InfoBanner = connect(mapStateToProps)(InfoBannerInner);

SWReactRootComponent(InfoBanner, "InfoBanner");
