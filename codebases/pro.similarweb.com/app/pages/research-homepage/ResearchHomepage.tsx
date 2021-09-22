/**
 * Created by Sahar.Rehani on 11/8/2017.
 */

import swLog from "@similarweb/sw-log";
import { FlexGrid } from "@similarweb/ui-components/dist/flex-grid";
import { Title } from "@similarweb/ui-components/dist/title";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { i18nFilter } from "filters/ngFilters";
import { PureComponent } from "react";
import * as React from "react";
import { allTrackers } from "services/track/track";
import LocationService from "../../../.pro-features/components/Modals/src/UnlockModal/LocationService";
import { isAvailable } from "../../../scripts/common/services/pageClaims";
import { ISwSettings } from "../../@types/ISwSettings";
import I18n from "../../components/React/Filters/I18n";
import { openUnlockModal } from "../../services/ModalService";
import { CustomCategories } from "./components/CustomCategories/CustomCategories";
import { KeywordGroups } from "./components/KeywordGroups/KeywordGroups";
import { SavedProperties } from "./components/SavedProperties/SavedProperties";
import { TrendingApps } from "./components/TrendingApps/TrendingApps";
import { TrendingKeywords } from "./components/TrendingKeywords/TrendingKeywords";
import { TrendingWebsites } from "./components/TrendingWebsites/TrendingWebsites";
import pageColumns from "./pageColumns";
import {
    BoxStates,
    fakeLoadingTime,
    getCustomCategoryHash,
    getDefaultPageState,
    halfFlipAnimationDuration,
    onPaging,
    resourcesNames,
} from "./pageDefaults";
import { fetchersMap, transformsMap } from "./pageResources";
import { CustomCategoriesWizard } from "components/customCategoriesWizard/CustomCategoriesWizard";
import { PreferencesService } from "services/preferences/preferencesService";

export class ResearchHomepage extends PureComponent<any, any> {
    private startTime;
    private swSettings: ISwSettings = swSettings;
    private timeoutId: number;

    constructor(props, context) {
        super(props, context);
        this.state = {
            boxes: getDefaultPageState(),
        };
    }

    public componentDidMount() {
        this.startTime = new Date().getTime();
        this.fetchResource(resourcesNames.savedProperties);
        this.fetchResource(
            resourcesNames.customCategories,
            this.swSettings.components.Home.resources.IsCCAllowed as boolean,
        );
        this.fetchResource(
            resourcesNames.keywordGroups,
            !this.swSettings.components.KeywordAnalysisOP.isDisabled,
        );
        this.fetchResource(resourcesNames.trendingWebsites);
        this.fetchResource(resourcesNames.trendingApps);
        this.fetchResource(resourcesNames.trendingKeywords);
    }

    public componentWillUnmount() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }
    }

    public render() {
        return (
            <div className="researchHomepage">
                <FlexGrid>
                    <Title className="Title--researchHomepage">
                        <I18n>research.homepage.title</I18n>
                    </Title>
                    <SavedProperties {...this.getProps(resourcesNames.savedProperties)} />
                    <CustomCategories
                        {...this.getProps(resourcesNames.customCategories)}
                        onEdit={(categoryName, categoryInitialName) =>
                            this.updateCategoriesResources(categoryName, categoryInitialName)
                        }
                        onUpgrade={(location: string) =>
                            this.onUpgrade(resourcesNames.customCategories, location)
                        }
                        addClick={() => {
                            this.setState({ showCustomCategoriesModal: true });
                        }}
                    />
                    <CustomCategoriesWizard
                        isOpen={this.state.showCustomCategoriesModal}
                        onClose={() => {
                            this.setState({ showCustomCategoriesModal: false });
                        }}
                        wizardProps={{
                            stayOnPage: true,
                            onSave: async () => {
                                await this.updateResource(
                                    resourcesNames.customCategories,
                                    transformsMap[resourcesNames.customCategories],
                                );
                                this.setState({ showCustomCategoriesModal: false });
                            },
                        }}
                    />
                    <KeywordGroups
                        {...this.getProps(resourcesNames.keywordGroups)}
                        onAdd={() =>
                            this.updateResource(
                                resourcesNames.keywordGroups,
                                transformsMap[resourcesNames.keywordGroups],
                            )
                        }
                        onEdit={() =>
                            this.updateResource(
                                resourcesNames.keywordGroups,
                                transformsMap[resourcesNames.keywordGroups],
                            )
                        }
                        onUpgrade={(location: string) =>
                            this.onUpgrade(resourcesNames.keywordGroups, location)
                        }
                    />
                    <TrendingWebsites {...this.getProps(resourcesNames.trendingWebsites)} />
                    <TrendingApps {...this.getProps(resourcesNames.trendingApps)} />
                    <TrendingKeywords {...this.getProps(resourcesNames.trendingKeywords)} />
                </FlexGrid>
            </div>
        );
    }

    public getProps = (resourceName) => {
        return {
            prevState: this.state.boxes[`${resourceName}Box`].prevState,
            state: this.state.boxes[`${resourceName}Box`].state,
            isFlipping: this.state.boxes[`${resourceName}Box`].isFlipping,
            table: this[`${resourceName}Table`],
            filters: this.getBoxFilters(resourceName),
            onFiltersChange: this.onFiltersChange,
            toggleSettings: this.toggleSettings,
        };
    };

    public fetchResource = async (resourceName, condition = true) => {
        const boxFilters = this.state.boxes[`${resourceName}Box`];
        const response = condition ? await fetchersMap[resourceName](boxFilters) : undefined;

        const endTime = new Date().getTime();
        const diff = endTime - this.startTime;
        if (diff > fakeLoadingTime) {
            this.setResourceState(
                resourceName,
                this.getResourceState(response, resourceName, boxFilters),
            );
        } else {
            this.timeoutId = window.setTimeout(() => {
                this.setResourceState(
                    resourceName,
                    this.getResourceState(response, resourceName, boxFilters),
                );
                this.timeoutId = null;
            }, fakeLoadingTime - diff);
        }
    };

    public getResourceState = (response, resourceName, filters) => {
        if (response) {
            const data = response.payload;
            if (response.success) {
                this[`${resourceName}Table`] = this.getTableProps(
                    resourceName,
                    transformsMap[resourceName](data, filters),
                );
                return {
                    ...this.state.boxes[`${resourceName}Box`],
                    state:
                        this[`${resourceName}Table`].data.length === 0
                            ? BoxStates.EMPTY
                            : BoxStates.READY,
                };
            } else {
                swLog.error(`${resourceName} request has failed`, data);
                return {
                    ...this.state.boxes[`${resourceName}Box`],
                    state: BoxStates.FAILED,
                };
            }
        } else {
            // no response means this box is not allowed
            return {
                ...this.state.boxes[`${resourceName}Box`],
                state: BoxStates.UPGRADE,
            };
        }
    };

    public setResourceState = (resourceName, state, filters?) => {
        this.setState({
            boxes: {
                ...this.state.boxes,
                [`${resourceName}Box`]: {
                    ...state,
                    ...filters,
                },
            },
        });
    };

    public getTableProps = (resourceName, data) => {
        return {
            data,
            columns: this.replaceI18nValues(pageColumns[`${resourceName}Columns`]),
            onPaging: (page) => onPaging(resourceName, page),
            metadata: {
                ...this.state.boxes[`${resourceName}Box`],
                trackName: resourceName,
            },
        };
    };

    public updateResource = async (resourceName, transformFunc, filters?) => {
        const newFilters = {
            ...this.state.boxes[`${resourceName}Box`],
            ...filters,
            customCategoryHash: getCustomCategoryHash(filters),
        };
        const response = await fetchersMap[resourceName](newFilters);
        this.setResourceState(
            resourceName,
            this.getResourceState(response, resourceName, newFilters),
            filters,
        );
    };

    public updateCategoriesResources = async (categoryName, categoryInitialName) => {
        this.updateResource(resourcesNames.customCategories, transformsMap.customCategories);
        this.updateCategory(
            categoryName,
            categoryInitialName,
            resourcesNames.trendingWebsites,
            transformsMap.trendingWebsites,
        );
        this.updateCategory(
            categoryName,
            categoryInitialName,
            resourcesNames.trendingKeywords,
            transformsMap.trendingKeywords,
        );
    };

    public updateCategory = (categoryName, categoryInitialName, resourceName, transformFunc) => {
        if (categoryName === this.state.boxes[`${resourceName}Box`].category) {
            // if the selected category was edited
            this.updateResource(resourceName, transformFunc);
        } else if (categoryInitialName === this.state.boxes[`${resourceName}Box`].category) {
            // if the selected category was edited and the name changed
            this.onFiltersChange(
                resourceName,
                this.state.boxes[`${resourceName}Box`].country,
                categoryName,
            );
        }
    };

    public getBoxFilters = (resourceName) => {
        const boxState = this.state.boxes[`${resourceName}Box`];
        return {
            country: boxState.country,
            category: boxState.category,
            page: boxState.page,
            store: boxState.store,
            device: boxState.device,
        };
    };

    public toggleSettings = (resourceName, prevBoxState, nextBoxState) => {
        allTrackers.trackEvent(
            "settings",
            prevBoxState === BoxStates.SETTINGS ? "close" : "open",
            resourceName,
        );

        if (
            resourceName === "trendingKeywords" &&
            !isAvailable(this.swSettings.components.IndustryAnalysisTopKeywords)
        ) {
            const unlockModal = { modal: "IASearch", slide: "TopKeywords" };
            const location = `${LocationService.getCurrentLocation()}/Trending Keywords`;
            openUnlockModal(unlockModal, location);
            return;
        }
        const toggle = () => {
            this.setState(
                {
                    boxes: {
                        ...this.state.boxes,
                        [`${resourceName}Box`]: {
                            ...this.state.boxes[`${resourceName}Box`],
                            prevState: prevBoxState,
                            state: nextBoxState,
                            isFlipping: false,
                        },
                    },
                },
                () => {
                    this.timeoutId = null;
                },
            );
        };

        this.setState(
            {
                boxes: {
                    ...this.state.boxes,
                    [`${resourceName}Box`]: {
                        ...this.state.boxes[`${resourceName}Box`],
                        isFlipping: true,
                    },
                },
            },
            () => {
                this.timeoutId = window.setTimeout(toggle, halfFlipAnimationDuration); // allow half box flip animation (total animation 0.5s)
            },
        );
    };

    public onUpgrade = (resourceName: string, location: string) => {
        const modal = resourceName.replace(resourceName[0], resourceName[0].toUpperCase());
        openUnlockModal({ modal }, location);
    };

    public onFiltersChange = (resourceName, country, category?, store?, device?) => {
        this.setState({
            boxes: {
                ...this.state.boxes,
                [`${resourceName}Box`]: {
                    ...this.state.boxes[`${resourceName}Box`],
                    state: BoxStates.LOADING,
                    prevState: BoxStates.LOADING,
                },
            },
        });
        const filters = {
            page: 1,
            country,
            category,
            store,
            device,
        };
        this.updateResource(resourceName, transformsMap[resourceName], filters);
        PreferencesService.add({
            [`${resourceName}Filters`]: {
                country,
                category,
                store,
            },
        });
        allTrackers.trackEvent(
            "Research_homepage filter",
            "submit-ok",
            `${resourceName}/country_filter=${country}&&category_filter=${category}&&store_filter=${store}`,
        );
    };

    private replaceI18nValues = (columns) => {
        if (!columns) {
            return;
        }
        return columns.map((col) => {
            return {
                ...col,
                displayName: i18nFilter()(col.displayName),
            };
        });
    };
}

export default SWReactRootComponent(ResearchHomepage, "ResearchHomepage");
