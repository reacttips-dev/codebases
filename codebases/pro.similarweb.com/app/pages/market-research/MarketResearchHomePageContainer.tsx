import PrimaryHomepageCustomBody from "@similarweb/ui-components/dist/homepages/primary/src/PrimaryHomepageCustomBody";
import { setSecondaryBarType, toggleSecondaryBar } from "actions/secondaryBarActions";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { connect } from "react-redux";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";
import { useMemo, useState } from "react";
import { AutocompleteMarketResearch } from "components/AutocompleteMarketResearch/AutocompleteMarketResearch";
import { isAvailable } from "common/services/pageClaims";
import { swSettings } from "common/services/swSettings";
import { AssetsService } from "services/AssetsService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { openUnlockModal } from "services/ModalService";
import LocationService from "components/Modals/src/UnlockModal/LocationService";
import { getWsConfigFromState } from "pages/workspace/config/stateToWsConfigMap";
import { PrimaryHomepageItemTileStyled } from "./styleComponents";
import {
    DEFAULT_HOMEPAGE_PREFERENCE_KEY,
    DEFAULT_HOMEPAGES,
    DefaultHomePageModal,
} from "components/moadls/DefaultHomePageModal";
import { useCallback } from "react";
import swLog from "@similarweb/sw-log";
import { PreferencesService } from "services/preferences/preferencesService";

const translate = i18nFilter();

export enum DEFAULT_HOMEPAGE_LOADING_STATUS {
    INIT = "init",
    LOADING = "loading",
    SUCCESS = "success",
}

const homepageItemClick = (goToState, navigator): void => {
    const { name } = goToState;
    // eslint-disable-next-line @typescript-eslint/camelcase
    TrackWithGuidService.trackWithGuid("mi-homepage.item.click", "click", { item_name: name });
    navigator.go(goToState);
};

// on locked tile clicked:
const hookClickHandler = (state, navigator: SwNavigator) => {
    const wsConfig = getWsConfigFromState(state, navigator.getParams());
    const unlockHook = { modal: wsConfig.unlockHook.modal, slide: wsConfig.unlockHook.slide };

    //const unlockHook = { modal: "WebsitePerformance", slide: "WebsitePerformance" };
    const location = `${LocationService.getCurrentLocation()}/New Category`;
    openUnlockModal(unlockHook, location);
};

const homeResearchTileRow = (navigator: SwNavigator, tileList) => {
    return tileList.map((tile) => {
        const { primaryText, description, iconName, stateName } = tile;
        const state = navigator.getState(stateName);
        const componentId = state?.configId;
        const isLocked = !isAvailable(swSettings.components[componentId]);

        const onClick = isLocked
            ? () => {
                  hookClickHandler(state, navigator);
              }
            : () => {
                  homepageItemClick(state, navigator);
              };

        return (
            <PrimaryHomepageItemTileStyled
                key={primaryText}
                primaryText={primaryText}
                secondaryText={description}
                buttonIconName={isLocked ? "locked" : "arrow-right"}
                onClick={onClick}
                iconName={iconName}
                iconSize="xl"
                isLocked={isLocked}
            />
        );
    });
};

const homeResearchTiles = (navigator: SwNavigator, tileList) => {
    return tileList().map((tileGroup) => {
        const { title, innerContentElement } = tileGroup;
        return {
            title: title,
            innerContentElement: homeResearchTileRow(navigator, innerContentElement),
            key: title,
        };
    });
};

const tileList = () => {
    return [
        {
            title: translate("marketintelligence.homepage.webMarket.industry.research.title"),
            innerContentElement: [
                {
                    iconName: "web-industry-analysis",
                    primaryText: translate(
                        "marketintelligence.homepage.webMarket.industry.analysis.title",
                    ),
                    description: translate(
                        "marketintelligence.homepage.webMarket.industry.analysis.description",
                    ),
                    isLocked: false,
                    stateName: "marketresearch_webmarketanalysis_home",
                },
                {
                    iconName: "app-category-analysis",
                    primaryText: translate(
                        "marketintelligence.homepage.webMarket.category.analysis.title",
                    ),
                    description: translate(
                        "marketintelligence.homepage.webMarket.category.analysis.description",
                    ),
                    isLocked: false,
                    stateName: "marketresearch_appmarketanalysis_home",
                },
                {
                    iconName: "search-interest-analysis",
                    primaryText: translate(
                        "marketintelligence.homepage.webMarket.interest.analysis.title",
                    ),
                    description: translate(
                        "marketintelligence.homepage.webMarket.interest.analysis.description",
                    ),
                    isLocked: false,
                    stateName: "marketresearch_keywordmarketanalysis_home",
                },
            ],
        },
        {
            title: translate("marketintelligence.homepage.webMarket.company.research.title"),
            innerContentElement: [
                {
                    iconName: "website-analysis",
                    primaryText: translate(
                        "marketintelligence.homepage.webMarket.website.analysis.title",
                    ),
                    description: translate(
                        "marketintelligence.homepage.webMarket.website.analysis.description",
                    ),
                    isLocked: false,
                    stateName: "companyresearch_websiteanalysis_home",
                },
                {
                    iconName: "segment-analysis",
                    primaryText: translate(
                        "marketintelligence.homepage.webMarket.segment.analysis.title",
                    ),
                    description: translate(
                        "marketintelligence.homepage.webMarket.segment.analityst.description",
                    ),
                    isLocked: false,
                    stateName: "companyresearch_segments-homepage",
                },
                {
                    iconName: "app-analysis",
                    primaryText: translate(
                        "marketintelligence.homepage.webMarket.app.analysis.title",
                    ),
                    description: translate(
                        "marketintelligence.homepage.webMarket.app.analysis.description",
                    ),
                    isLocked: false,
                    stateName: "companyresearch_appanalysis_home",
                },
                // {
                //     iconName: "company-analysis",
                //     primaryText: translate("marketintelligence.homepage.webMarket.company.analysis.title"),
                //     description: translate("marketintelligence.homepage.webMarket.company.analysis.description"),
                //     isLocked: false,
                //     state: "marketresearch_keywordmarketanalysis_home",
                // },
            ],
        },
    ];
};
interface IMarketResearchModuleHomePageProps {
    toggleSecondaryBar: (isOpen: boolean) => void;
    setSecondaryBarType: (type: SecondaryBarType) => void;
}

const headerImageUrl = AssetsService.assetUrl("/images/primary-home-page-header.png");

export const MarketResearchModuleHomePage: React.SFC<IMarketResearchModuleHomePageProps> = ({
    toggleSecondaryBar,
    setSecondaryBarType,
}) => {
    const navigator = useMemo(() => Injector.get<SwNavigator>("swNavigator"), []);
    const defaultHomepage = PreferencesService.get(DEFAULT_HOMEPAGE_PREFERENCE_KEY);
    const [homePageLoadStatus, setHomePageLoadStatus] = useState(
        DEFAULT_HOMEPAGE_LOADING_STATUS.INIT,
    );

    const onHomepageButtonClick = useCallback(
        (key) => async () => {
            TrackWithGuidService.trackWithGuid("homepage.button.set_default_homepage", "click", {
                packageName: "research",
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
            (defaultHomepage !== DEFAULT_HOMEPAGES.MRI ||
                homePageLoadStatus === DEFAULT_HOMEPAGE_LOADING_STATUS.SUCCESS) &&
            defaultHomepage !== undefined,
        [defaultHomepage, homePageLoadStatus],
    );

    React.useEffect(() => {
        setSecondaryBarType("MarketResearch");
        toggleSecondaryBar(true);
    }, []);

    const Autocomplete = useMemo(() => {
        return <AutocompleteMarketResearch />;
    }, []);

    return (
        <>
            {!defaultHomepage && <DefaultHomePageModal hasDefaultHomepage={defaultHomepage} />}
            <PrimaryHomepageCustomBody
                title={translate("marketintelligence.homepage.mainTitle")}
                subtitle={translate("marketintelligence.homepage.subTitle")}
                subtitlePosition="left-aligned"
                taglineText={translate("marketintelligence.homepage.tagline")}
                searchComponents={Autocomplete}
                bodyText={translate("marketintelligence.homepage.bodyText")}
                usecaseItems={homeResearchTiles(navigator, tileList)}
                headerImageUrl={headerImageUrl}
                showButton={isButtonShown}
                disableButton={homePageLoadStatus === DEFAULT_HOMEPAGE_LOADING_STATUS.SUCCESS}
                buttonText={i18nFilter()("homepage.header.default.button.text")}
                buttonIconName={iconName}
                onButtonClick={onHomepageButtonClick(DEFAULT_HOMEPAGES.MRI)}
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

const ConnectedMarketResearchModuleHomePage = connect(
    null,
    mapDispatchToProps,
)(MarketResearchModuleHomePage);

SWReactRootComponent(ConnectedMarketResearchModuleHomePage, "MarketResearchModuleHomePage");
