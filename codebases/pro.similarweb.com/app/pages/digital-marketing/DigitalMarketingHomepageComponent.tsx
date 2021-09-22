import PrimaryHomePage from "@similarweb/ui-components/dist/homepages/primary/src/PrimaryHomepage";
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import { connect } from "react-redux";
import { setSecondaryBarType, toggleSecondaryBar } from "actions/secondaryBarActions";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { AutocompleteDigitalMarketing } from "components/AutocompleteDigitalMarketing/AutocompleteDigitalMarketing";
import { AssetsService } from "services/AssetsService";
import {
    DEFAULT_HOMEPAGE_PREFERENCE_KEY,
    DEFAULT_HOMEPAGES,
    DefaultHomePageModal,
} from "components/moadls/DefaultHomePageModal";
import swLog from "@similarweb/sw-log";
import { DEFAULT_HOMEPAGE_LOADING_STATUS } from "pages/market-research/MarketResearchHomePageContainer";
import { i18nFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { PreferencesService } from "services/preferences/preferencesService";

interface IDigitalMarketingHomePageComponentConnectedProps {
    toggleSecondaryBar: (isOpen: boolean) => void;
    setSecondaryBarType: (type: SecondaryBarType) => void;
}

interface IDigitalMarketingHomePageComponentProps {
    homePageItems: ReactNode;
    title: string;
    subtitle: string;
    taglineText: string;
    bodyText: string;

    /**
     * Defines whether we want to display keyword searches / recents
     * in the autocomplete. some homepages don't want to show this dataset.
     * (such as the noTouch homepages)
     */
    includeKeywordsOnAutocomplete?: boolean;
}

const headerImageUrl = AssetsService.assetUrl("/images/primary-home-page-header.png");

export const DigitalMarketingHomePageComponent: React.FC<
    IDigitalMarketingHomePageComponentConnectedProps & IDigitalMarketingHomePageComponentProps
> = ({
    toggleSecondaryBar,
    setSecondaryBarType,
    homePageItems,
    bodyText,
    subtitle,
    taglineText,
    title,
    includeKeywordsOnAutocomplete = true,
}) => {
    useEffect(() => {
        setSecondaryBarType("DigitalMarketing");
        toggleSecondaryBar(true);
    }, []);

    const defaultHomepage = PreferencesService.get(DEFAULT_HOMEPAGE_PREFERENCE_KEY);
    const [homePageLoadStatus, setHomePageLoadStatus] = useState(
        DEFAULT_HOMEPAGE_LOADING_STATUS.INIT,
    );

    const onHomepageButtonClick = useCallback(
        (key) => async () => {
            TrackWithGuidService.trackWithGuid("homepage.button.set_default_homepage", "click", {
                packageName: "digital marketing",
            });
            setHomePageLoadStatus(DEFAULT_HOMEPAGE_LOADING_STATUS.LOADING);
            try {
                await PreferencesService.add({ [DEFAULT_HOMEPAGE_PREFERENCE_KEY]: key });
                setHomePageLoadStatus(DEFAULT_HOMEPAGE_LOADING_STATUS.SUCCESS);
            } catch (e) {
                swLog.error(e);
            }
        },
        [],
    );

    const iconName = useMemo(() => {
        switch (homePageLoadStatus) {
            case DEFAULT_HOMEPAGE_LOADING_STATUS.INIT:
                return "homepage";
            case DEFAULT_HOMEPAGE_LOADING_STATUS.LOADING:
                return "spinner";
            case DEFAULT_HOMEPAGE_LOADING_STATUS.SUCCESS:
                return "checked";
            default:
                return "homepage";
        }
    }, [homePageLoadStatus]);

    const isButtonShown = useMemo(
        () =>
            (defaultHomepage !== DEFAULT_HOMEPAGES.DMI ||
                homePageLoadStatus === DEFAULT_HOMEPAGE_LOADING_STATUS.SUCCESS) &&
            defaultHomepage !== undefined,
        [defaultHomepage, homePageLoadStatus],
    );

    const Autocomplete = useMemo(() => {
        return <AutocompleteDigitalMarketing includeKeywordsData={includeKeywordsOnAutocomplete} />;
    }, []);

    return (
        <>
            {!defaultHomepage && <DefaultHomePageModal hasDefaultHomepage={defaultHomepage} />}
            <PrimaryHomePage
                title={title}
                subtitle={subtitle}
                subtitlePosition="left-aligned"
                taglineText={taglineText}
                searchComponents={Autocomplete}
                bodyText={bodyText}
                usecaseItems={homePageItems}
                headerImageUrl={headerImageUrl}
                showButton={isButtonShown}
                disableButton={homePageLoadStatus === DEFAULT_HOMEPAGE_LOADING_STATUS.SUCCESS}
                buttonText={i18nFilter()("homepage.header.default.button.text")}
                buttonIconName={iconName}
                onButtonClick={onHomepageButtonClick(DEFAULT_HOMEPAGES.DMI)}
                setDefaultHomepageLoading={
                    homePageLoadStatus === DEFAULT_HOMEPAGE_LOADING_STATUS.LOADING
                }
            />
        </>
    );
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleSecondaryBar: (isOpen: boolean) => {
            dispatch(toggleSecondaryBar(isOpen));
        },
        setSecondaryBarType: (type: SecondaryBarType) => {
            dispatch(setSecondaryBarType(type));
        },
    };
};

export const DigitalMarketingHomePage: React.FC<IDigitalMarketingHomePageComponentProps> = connect(
    null,
    mapDispatchToProps,
)(DigitalMarketingHomePageComponent);

DigitalMarketingHomePage.defaultProps = {
    includeKeywordsOnAutocomplete: true,
};
