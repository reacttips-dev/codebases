import { IconButton } from "@similarweb/ui-components/dist/button";
import HomepageCustomMarketsItem from "@similarweb/ui-components/dist/homepages/common/UseCaseHomepageItems/HomepageCustomMarketsItem";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import LocationService from "components/Modals/src/UnlockModal/LocationService";
import I18n from "components/WithTranslation/src/I18n";
import TranslationProvider from "components/WithTranslation/src/TranslationProvider";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { IndustryAnalysisStartPage } from "pages/module start page/src/industry analysis/IndustryAnalysisStartPage";
import { string } from "prop-types";
import React, { FunctionComponent, useMemo, useState } from "react";
import { connect } from "react-redux";
import { openUnlockModal } from "services/ModalService";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import { $robotoFontFamily } from "@similarweb/styles/src/fonts";
import { SwNavigator } from "common/services/swNavigator";
import { IRootScopeService } from "angular";
import { CustomCategoriesWizard } from "components/customCategoriesWizard/CustomCategoriesWizard";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import categoryService from "common/services/categoryService";

const PlaceholderText = styled.span`
    color: ${colorsPalettes.carbon["300"]};
    font-family: ${$robotoFontFamily};
    font-size: 14px;
    margin-left: 32px;
`;

const BoldPlaceholderText = styled.span`
    font-weight: 500;
`;

const DEFAULT_PAGE_STATE = "industryAnalysis-overview";

interface IIndustryAnalysisStartPageContainerProps {
    pageState?: string;
    subtitlePosition?: string;
    title: string;
    subtitle: string;
    bodyText?: string;
    ctaButtonText?: string;
}

const IndustryAnalysisStartPageContainer: FunctionComponent<IIndustryAnalysisStartPageContainerProps> = ({
    pageState,
    subtitlePosition,
    title,
    subtitle,
    bodyText,
    ctaButtonText,
}) => {
    const homepageProps = {
        subtitlePosition,
        title,
        subtitle,
        bodyText,
    };

    const [showCustomCategoriesWizard, setShowCustomCategoriesWizard] = useState(false);
    const [customCategoriesEditItem, setCustomCategoriesEditItem] = useState(null);
    const services = useMemo(() => {
        return {
            swNavigator: Injector.get<SwNavigator>("swNavigator"),
            $rootScope: Injector.get<IRootScopeService>("$rootScope"),
            $modal: Injector.get<any>("$modal"),
            categoryService,
            track: TrackWithGuidService,
            swSettings,
            i18n: i18nFilter(),
        };
    }, []);

    const [customCategories, setCustomCategories] = useState(
        UserCustomCategoryService.getCustomCategories(),
    );

    const handleCreateNewCategoryClick = () => {
        // track
        if (!services.swSettings.components.Home.resources.IsCCAllowed) {
            services.track.trackWithGuid(
                "solutions2.industryAnalysis.home.create_category",
                "open",
            );
        }

        // action
        if (services.swSettings.components.Home.resources.IsCCAllowed) {
            setShowCustomCategoriesWizard(true);
            setCustomCategoriesEditItem(null);
        } else {
            const unlockHook = { modal: "CustomCategories", slide: "NewCategory" };
            const location = `${LocationService.getCurrentLocation()}/New Category`;
            openUnlockModal(unlockHook, location);
        }
    };

    const handleEditClick = (item) => () => {
        setShowCustomCategoriesWizard(true);
        setCustomCategoriesEditItem(item);
    };

    const handleItemClick = (item) => () => {
        services.track.trackWithGuid(
            "solutions2.industryAnalysis.home.select.custom_category",
            "click",
            { customCategory: item.text },
        );
        const defaultParams =
            swSettings.components[services.swNavigator.getState(pageState).configId].defaultParams;
        delete defaultParams.pageUrl;
        services.swNavigator.go(pageState, {
            ...defaultParams,
            category: item.forUrl,
            webSource: "Total",
            comparedDuration: "",
        });
    };

    const getListItems = (listItems) => {
        return listItems.map((customCategory, idx) => {
            return (
                <HomepageCustomMarketsItem
                    key={customCategory.id}
                    id={idx}
                    customMarketName={customCategory.text}
                    websiteCount={customCategory.domains.length}
                    onEditClick={handleEditClick(customCategory)}
                    onItemClick={handleItemClick(customCategory)}
                />
            );
        });
    };

    const PlaceholderComponent = () => (
        <PlaceholderText>
            {services.i18n("marketintelligence.marketresearch.webmarketanalysis.home.searchText")}{" "}
            <BoldPlaceholderText>
                {services.i18n(
                    "marketintelligence.marketresearch.webmarketanalysis.home.searchItem",
                )}
            </BoldPlaceholderText>
        </PlaceholderText>
    );

    const ctaButton = [
        <IconButton
            key="button-1"
            type="outlined"
            iconName="plus"
            onClick={handleCreateNewCategoryClick}
        >
            <I18n>{ctaButtonText}</I18n>
        </IconButton>,
    ];

    return (
        <TranslationProvider translate={services.i18n}>
            <CustomCategoriesWizard
                isOpen={showCustomCategoriesWizard}
                onClose={() => setShowCustomCategoriesWizard(false)}
                wizardProps={{
                    onSave: async () => {
                        await setCustomCategories(UserCustomCategoryService.getCustomCategories());
                        if (customCategoriesEditItem) {
                            setShowCustomCategoriesWizard(false);
                        }
                    },
                    customCategoryName: customCategoriesEditItem?.text ?? null,
                    stayOnPage: !!customCategoriesEditItem,
                }}
            />
            <IndustryAnalysisStartPage
                listButtons={ctaButton}
                listItems={getListItems(customCategories)}
                handleItemClick={handleItemClick}
                autocompletePlaceholder={PlaceholderComponent()}
                {...homepageProps}
            />
        </TranslationProvider>
    );
};

IndustryAnalysisStartPageContainer.propTypes = {
    pageState: string,
    subtitlePosition: string,
    title: string,
    subtitle: string,
    bodyText: string,
    ctaButtonText: string,
};

IndustryAnalysisStartPageContainer.defaultProps = {
    pageState: DEFAULT_PAGE_STATE,
    subtitlePosition: "left-aligned",
    bodyText: "webmarketanalysis.homepage.bodyText",
    ctaButtonText: "webmarketanalysis.cta.button",
};

export default SWReactRootComponent(
    connect(null, null)(IndustryAnalysisStartPageContainer),
    "IndustryAnalysisStartPageContainer",
);
