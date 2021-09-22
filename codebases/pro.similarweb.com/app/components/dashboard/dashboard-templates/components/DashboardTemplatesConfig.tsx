import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import * as React from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import DashboardWizardCountry from "components/dashboard/widget-wizard/components/DashboardWizardCountry";
import { Injector } from "common/ioc/Injector";
import I18n from "components/React/Filters/I18n";
import { artStep, DashboardTemplatesConfigArt } from "./DashboardTemplatesConfigArt";
import {
    DashboardTemplateService,
    IDashboardTemplate,
    EDashboardOriginType,
    EDashboardParentType,
} from "../DashboardTemplateService";
import { IDashboardService } from "../../services/DashboardService";
import { setSharedWithMeDashboards } from "../../../../pages/dashboard/DashboardSideNavActions";
import {
    clearSelectedTemplate,
    templateAddKey,
    templateChangeCountry,
    templateRemoveKey,
} from "../actions/dashboardTemplateActions";
import {
    IProModalCustomStyles,
    ProModal,
} from "../../../../../.pro-features/components/Modals/src/ProModal";
import { ButtonGroup } from "../../../../../.pro-features/components/ButtonsGroup/src/ButtonsGroup";

import {
    ListItemDefault,
    ListItemWebsite,
    ListItemApp,
    ListItemIndustry,
    ListItemKeyword,
} from "@similarweb/ui-components/dist/list-item";

import {
    SimpleChipItem,
    CategoryChipItem,
    WebsiteChipItem,
    AppChipItem,
} from "@similarweb/ui-components/dist/chip";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";

import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";

import { AutocompleteWithItems } from "@similarweb/ui-components/dist/autocomplete";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { ScrollArea } from "@similarweb/ui-components/dist/react-scrollbar";
import { allTrackers } from "../../../../services/track/track";
import { PureComponent } from "react";
import { i18nFilter } from "../../../../filters/ngFilters";
import { ISwSettings } from "../../../../@types/ISwSettings";
import { showIntercom } from "../../../../services/IntercomService";
import {
    AutocompleteWrapper,
    DashboardWizardCountryWrap,
    DashboardWizardPreviewImage,
    DashboardWizardPreviewImageHeader,
    StepFooter,
    StepHeader,
    StepList,
    StepListItem,
    StepParagraph,
    StepsContainer,
    StepsContent,
    StepsContentPaneLeft,
    StepsContentPaneRight,
    StepsContentPaneRightBottom,
    StepsContentPaneRightTop,
    StepSubHeader,
    StepText,
} from "./styledComponents";
import { IDashboardTemplateState } from "../reducers/dashboardTemplateReducer";

const KEY_METRICS_LENGTH = 4;

export enum EFamilyTypes {
    Website = "WEBSITE",
    Apps = "APPS",
    Keyword = "KEYWORD",
    Categories = "CATEGORIES",
}

interface IFamilyTypeObj {
    name: string;
    placeholderEmpty: string;
    placeholderFull: string;
    placeholderOneOrMore: string;
    icon: string;
    searchTypeStr: string;
    componentId: string;
    defaultCountry?: number;
}

const i18n = i18nFilter();

const familiesConfigObj = {
    [EFamilyTypes.Website]: {
        name: "Website",
        description: i18n("home.dashboards.wizard.template_config.left.pane.website.description"),
        placeholderEmpty: i18n("dashboards.wizard.template_config.Website.placeholderEmpty"),
        placeholderFull: i18n("dashboards.wizard.template_config.Website.placeholderFull"),
        placeholderOneOrMore: i18n(
            "dashboards.wizard.template_config.Website.placeholderOneOrMore",
        ),
        icon: "globe",
        searchTypeStr: "website",
        componentId: "WebAnalysis",
        defaultCountry: 999,
    },
    [EFamilyTypes.Apps]: {
        name: "Apps",
        description: i18n("home.dashboards.wizard.template_config.left.pane.Apps.description"),
        placeholderEmpty: i18n("dashboards.wizard.template_config.Apps.placeholderEmpty"),
        placeholderFull: i18n("dashboards.wizard.template_config.Apps.placeholderFull"),
        placeholderOneOrMore: i18n("dashboards.wizard.template_config.Apps.placeholderOneOrMore"),
        icon: "app",
        searchTypeStr: "mobile",
        componentId: "AppAnalysis",
        defaultCountry: 840,
    },
    [EFamilyTypes.Keyword]: {
        name: "Keyword",
        description: i18n("home.dashboards.wizard.template_config.left.pane.keyword.description"),
        placeholderEmpty: i18n("dashboards.wizard.template_config.Keyword.placeholderEmpty"),
        placeholderFull: i18n("dashboards.wizard.template_config.Keyword.placeholderFull"),
        placeholderOneOrMore: i18n(
            "dashboards.wizard.template_config.Keyword.placeholderOneOrMore",
        ),
        icon: "search-keywords",
        searchTypeStr: "keyword",
        componentId: "KeywordAnalysis",
        defaultCountry: 999,
    },
    [EFamilyTypes.Categories]: {
        name: "Categories",
        description: i18n("home.dashboards.wizard.template_config.left.pane.category.description"),
        placeholderEmpty: i18n("dashboards.wizard.template_config.category.placeholderEmpty"),
        placeholderFull: i18n("dashboards.wizard.template_config.category.placeholderFull"),
        placeholderOneOrMore: i18n(
            "dashboards.wizard.template_config.category.placeholderOneOrMore",
        ),
        icon: "category",
        searchTypeStr: "industry",
        componentId: "IndustryAnalysis",
        defaultCountry: 999,
    },
};

const proModalStyles: IProModalCustomStyles = {
    content: {
        height: "90%",
        width: "800px",
        padding: 0,
    },
};

const scrollerStyle = {
    width: 7,
    opacity: 0.7,
    borderRadius: 10,
    backgroundColor: "#AAB2BA",
};

interface IDashboardTemplatesConfigState {
    templatePreviewIsOpen: boolean;
    selectedFamilyConfigObj: IFamilyTypeObj;
    // selectedCountry: number,
    loading?: boolean;
    isFocused?: boolean;
    selectedTemplateTitle: string;
    selectedTemplateDescription: string;
    title: string;
}

interface IDashboardTemplatesConfigConnectedProps {
    setSideNavItems: () => void;
    clearSelectedTemplate: () => void;
    addKey: (key) => void;
    removeKey: (key) => void;
    changeCountry: (country) => void;
    selectedTemplate: IDashboardTemplate;
    parentType?: EDashboardParentType;
    parentId?: string;
    originType?: EDashboardOriginType;
    originId?: string;
}

interface IDashboardTemplatesConfigProps extends IDashboardTemplatesConfigConnectedProps {
    title: string;
    country: number;
    keys: any[];
}

class DashboardTemplatesConfig extends PureComponent<
    IDashboardTemplatesConfigProps,
    IDashboardTemplatesConfigState
> {
    public static getDerivedStateFromProps(props, state) {
        if (state.title !== props.title) {
            return {
                title: props.title,
            };
        }

        return null;
    }

    private swSettings = swSettings;
    private userCountries;
    private autoCompleteService;
    private similarItemsService;
    private maxItems: number;
    private minItems: number;

    constructor(props, context) {
        super(props, context);
        const selectedFamilyConfigObj = familiesConfigObj[this.props.selectedTemplate.familyType];
        this.autoCompleteService = Injector.get("autoCompleteService");
        this.similarItemsService = Injector.get("similarItemsService");
        this.userCountries = this.getUserCountries(selectedFamilyConfigObj.componentId);
        this.maxItems = this.props.selectedTemplate.maxItems;
        this.minItems = this.props.selectedTemplate.minItems;
        this.state = {
            templatePreviewIsOpen: false,
            selectedFamilyConfigObj,
            isFocused: true,
            selectedTemplateTitle: i18nFilter()(this.props.selectedTemplate.title),
            selectedTemplateDescription: i18nFilter()(this.props.selectedTemplate.description),
            title: this.props.title,
        };
    }

    componentWillUnmount() {
        this.props.clearSelectedTemplate();
    }

    private getUserCountries(componentId) {
        const _component = this.swSettings.components[componentId];
        const mobileWebAllowedCountries: any = swSettings.current.resources.MobileWebCountries;
        const allowedCountries = [];
        _component.allowedCountries.forEach((country: any) => {
            const isMobileWeb = mobileWebAllowedCountries.indexOf(country.id) > -1;
            if (!country.children || country.children.length < 1) {
                allowedCountries.push({
                    ...country,
                    showDeviceIcon:
                        country.id !== 999 &&
                        [EFamilyTypes.Website, EFamilyTypes.Categories].indexOf(
                            this.props.selectedTemplate.familyType,
                        ) > -1,
                    mobileWeb: isMobileWeb,
                });
            } else {
                allowedCountries.push({
                    ...country,
                    showDeviceIcon:
                        country.id !== 999 &&
                        [EFamilyTypes.Website, EFamilyTypes.Categories].indexOf(
                            this.props.selectedTemplate.familyType,
                        ) > -1,
                    mobileWeb: isMobileWeb,
                });
                country.children.forEach((state) => {
                    allowedCountries.push({ ...state });
                });
            }
        });
        return allowedCountries;
    }

    changeCountry = (selectedCountry) => {
        this.props.changeCountry(selectedCountry);
    };

    getCountry = () => {
        return (
            this.props.country ||
            (_.find(this.userCountries, { id: this.state.selectedFamilyConfigObj.defaultCountry })
                ? this.state.selectedFamilyConfigObj.defaultCountry
                : this.userCountries[0].id)
        );
    };

    createDashboard = async () => {
        const { parentType, parentId, originType, originId } = this.props;
        showIntercom();
        await this.setStateAsync({
            loading: true,
        });
        const service = DashboardTemplateService;
        const clonedTemplate = service.cloneTemplate(this.props.selectedTemplate);
        const country = this.getCountry();
        const dashboard = service.populateTemplate(this.props.keys, country, clonedTemplate);
        allTrackers.trackEvent("dashboard template", "submit-ok", clonedTemplate.title);
        dashboard.title = Injector.get<IDashboardService>("dashboardService").generateNewTitle(
            this.state.title,
            "title",
        );
        const created = await service.saveDashboardTemplate(dashboard, parentType, parentId);
        if (created && created.length && created.length > 0) {
            const linkedToWorkspace =
                originType && originId
                    ? await service.linkDashboardToOrigin(originType, originId, created[0].id)
                    : true;
            this.props.setSideNavItems();
            this.props.clearSelectedTemplate();
            Injector.get<any>("swNavigator").go("dashboard-exist", {
                dashboardId: created[0].id,
            });
        }
        this.setStateAsync({
            loading: false,
        });
    };

    setStateAsync(state) {
        return new Promise<void>((resolve) => {
            this.setState(state, resolve);
        });
    }

    openTemplatePreview = (e) => {
        allTrackers.trackEvent("dashboard template", "click", "view sample");
        this.setState({ templatePreviewIsOpen: true });
    };
    openTemplatePreviewClose = () => {
        allTrackers.trackEvent("dashboard template", "close", "view sample");
        this.setState({ templatePreviewIsOpen: false });
    };

    // AutocompleteWithItems

    getPlaceholder = () => {
        const { keys } = this.props;
        const familyObj = this.state.selectedFamilyConfigObj;
        const selectedFamilyPlaceholder =
            keys.length === 0
                ? this.props.selectedTemplate.placeholderEmpty || familyObj.placeholderEmpty
                : keys.length === this.maxItems
                ? this.props.selectedTemplate.placeholderFull || familyObj.placeholderFull
                : familyObj.placeholderOneOrMore;
        return selectedFamilyPlaceholder;
    };

    isAutoCompleteDisabled = () => {
        const { keys } = this.props;
        return keys.length === this.maxItems;
    };

    removeKeyItem = (item) => () => {
        this.props.removeKey(item);
        allTrackers.trackEvent(this.state.selectedFamilyConfigObj.name, "remove", item.name);
    };
    addKeyItem = (item) => () => {
        this.props.addKey(this.prepareItemForExport(item));
        allTrackers.trackEvent(this.state.selectedFamilyConfigObj.name, "add", item.name);
    };

    getChipComponent = (item) => {
        const image = item.image || item.icon;
        switch (this.props.selectedTemplate.familyType) {
            case EFamilyTypes.Website:
                return (
                    <WebsiteChipItem
                        image={image}
                        text={item.name}
                        onCloseItem={this.removeKeyItem(item)}
                    />
                );
            case EFamilyTypes.Apps:
                return (
                    <AppChipItem
                        image={image}
                        text={item.name}
                        onCloseItem={this.removeKeyItem(item)}
                    />
                );
            case EFamilyTypes.Keyword:
                return <SimpleChipItem text={item.name} onCloseItem={this.removeKeyItem(item)} />;
            case EFamilyTypes.Categories:
                return (
                    <CategoryChipItem
                        icon={image}
                        text={item.name}
                        onCloseItem={this.removeKeyItem(item)}
                    />
                );
        }
    };

    listItemByFamily(item, store?) {
        let appStore = item.store;
        if (store !== undefined) {
            if (store === 0) {
                appStore = "google";
            } else {
                appStore = "apple";
            }
        }
        switch (this.props.selectedTemplate.familyType) {
            case EFamilyTypes.Website:
                return (
                    <ListItemWebsite
                        img={item.image}
                        key={item.name}
                        onClick={this.addKeyItem(item)}
                        text={item.name}
                    />
                );
            case EFamilyTypes.Categories:
                return (
                    <ListItemIndustry
                        iconClassName={item.icon}
                        iconName="category"
                        key={item.name}
                        onClick={this.addKeyItem(item)}
                        text={item.name}
                    />
                );
            case EFamilyTypes.Keyword:
                return (
                    <ListItemKeyword
                        iconClassName={item.icon || `sw-icon-keyword`}
                        iconName="search-keywords"
                        key={item.name}
                        onClick={this.addKeyItem(item)}
                        text={item.name}
                    />
                );
            case EFamilyTypes.Apps:
                return (
                    <ListItemApp
                        img={item.image}
                        store={appStore}
                        key={item.name}
                        onClick={this.addKeyItem(item)}
                        text={item.name}
                        subtitle={item.publisher}
                    />
                );
        }
    }

    getChips = () => this.props.keys.map(this.getChipComponent);

    getData = async (query) => {
        if (
            (typeof query === "string" && query !== "") ||
            (this.props.keys.length === 0 &&
                [EFamilyTypes.Categories, EFamilyTypes.Keyword].indexOf(
                    this.props.selectedTemplate.familyType,
                ) > -1)
        ) {
            const autoCompleteItems = await this.autoCompleteService.getAutoCompleteSuggestions(
                query,
                this.state.selectedFamilyConfigObj.searchTypeStr,
                "google",
            ).promise;
            return autoCompleteItems
                .filter(
                    (autoCompleteItem) =>
                        !this.props.keys.find((key) => key.name === autoCompleteItem.name),
                )
                .map((item) => this.listItemByFamily(item));
        } else if (this.props.keys.length > 0) {
            const autoCompleteItems = await this.getSimilarItems(this.props.keys[0]);
            return autoCompleteItems.map((item) => this.listItemByFamily(item, item.store));
        } else {
            return [];
        }
    };

    prepareItemForExport(item) {
        switch (this.props.selectedTemplate.familyType) {
            case EFamilyTypes.Categories:
                item.id = item.categoryId ? item.categoryId : `$${item.category}`;
                item.category = item.id;
                break;
            case EFamilyTypes.Keyword:
                item.id = item.groupId ? item.groupId : item.id;
                break;
        }
        return item;
    }

    getSimilarItems = async (key) => {
        const _key = { ...key };
        switch (this.props.selectedTemplate.familyType) {
            case EFamilyTypes.Website:
                _key.type = "Website";
                _key.appStore = "";
                break;
            case EFamilyTypes.Apps:
                _key.type = "Mobile";
                _key.appStore = _key.store;
                _key.name = _key.id;
                break;
        }
        const similarItems = await this.similarItemsService.getSimilarItems(_key, 10);
        return similarItems
            .map((similarItem) => ({
                id: similarItem.Domain || similarItem.ID,
                name: similarItem.Domain || similarItem.Title,
                image: similarItem.Favicon || similarItem.Icon,
                isSuggestion: true,
                publisher: similarItem.Author,
                store: similarItem.Store,
            }))
            .filter((similarItem) => !this.props.keys.find((key) => key.name === similarItem.name));
    };

    render() {
        const calculatedArtStep = this.getArtStep();
        const selectedItems = this.getChips();
        return (
            <StepsContainer>
                {this.props.selectedTemplate && (
                    <StepsContent>
                        <StepsContentPaneLeft>
                            <StepHeader>
                                <I18n>home.dashboards.wizard.template_config.left.pane.title</I18n>
                            </StepHeader>
                            <StepSubHeader>
                                <I18n>{`home.dashboards.wizard.template_config.left.pane.subtitle.${this.props.selectedTemplate.familyType}`}</I18n>
                            </StepSubHeader>
                            <StepText>
                                {this.props.selectedTemplate.autocompleteDescription ||
                                    familiesConfigObj[this.props.selectedTemplate.familyType]
                                        .description}
                            </StepText>
                            <AutocompleteWrapper>
                                <AutocompleteWithItems
                                    disabled={this.isAutoCompleteDisabled()}
                                    loadingComponent={<DotsLoader />}
                                    selectedItems={selectedItems}
                                    getListItems={this.getData}
                                    maxItems={this.maxItems}
                                    placeholder={this.getPlaceholder()}
                                    searchIcon={this.state.selectedFamilyConfigObj.icon}
                                    isFocused={selectedItems.length === 0 && this.state.isFocused}
                                    debounce={400}
                                    onFocus={() => {
                                        this.setState({ isFocused: true });
                                    }}
                                    onBlur={() => {
                                        this.setState({ isFocused: false });
                                    }}
                                />
                            </AutocompleteWrapper>
                            <DashboardWizardCountryWrap>
                                <DashboardWizardCountry
                                    changeCountry={this.changeCountry}
                                    availableCountries={this.userCountries}
                                    selectedCountryId={this.getCountry()}
                                    titleComponent={
                                        <div>
                                            <StepSubHeader>
                                                <I18n>home.dashboards.wizard.country.title</I18n>
                                            </StepSubHeader>
                                            <StepText>
                                                <I18n>
                                                    home.dashboards.wizard.template_config.left.pane.country.description
                                                </I18n>
                                            </StepText>
                                        </div>
                                    }
                                />
                            </DashboardWizardCountryWrap>
                        </StepsContentPaneLeft>
                        <StepsContentPaneRight>
                            <StepsContentPaneRightTop>
                                <StepHeader>
                                    <I18n>
                                        home.dashboards.wizard.template_config.right.pane.title
                                    </I18n>
                                </StepHeader>
                                <StepParagraph>
                                    <StepText>
                                        <I18n>{this.props.selectedTemplate.descriptionLong}</I18n>
                                    </StepText>
                                </StepParagraph>
                                <StepParagraph>
                                    <StepText>
                                        <I18n>{"dashboard.templates.keymetrics.title"}</I18n>
                                    </StepText>
                                    <StepList>{this.getKeyMetrics()}</StepList>
                                </StepParagraph>
                            </StepsContentPaneRightTop>
                            <StepsContentPaneRightBottom>
                                <DashboardTemplatesConfigArt step={calculatedArtStep} />
                            </StepsContentPaneRightBottom>
                        </StepsContentPaneRight>
                    </StepsContent>
                )}
                <StepFooter>
                    <ButtonGroup>
                        <Button type="flat" className="first" onClick={this.openTemplatePreview}>
                            <ButtonLabel>
                                <I18n>home.dashboards.wizard.template_config.right.pane.CTA.2</I18n>
                            </ButtonLabel>
                        </Button>
                        {this.getSubmitButton()}
                    </ButtonGroup>
                </StepFooter>
                {this.props.selectedTemplate && this.props.selectedTemplate.previewImage && (
                    <ProModal
                        customStyles={proModalStyles}
                        isOpen={this.state.templatePreviewIsOpen}
                        onCloseClick={this.openTemplatePreviewClose}
                    >
                        <DashboardWizardPreviewImage>
                            <DashboardWizardPreviewImageHeader>
                                <I18n>{this.props.selectedTemplate.title}</I18n>
                            </DashboardWizardPreviewImageHeader>
                            <ScrollArea
                                style={{ height: 300, flexGrow: 1 }}
                                verticalScrollbarStyle={scrollerStyle}
                            >
                                <img src={this.props.selectedTemplate.previewImage} />
                            </ScrollArea>
                        </DashboardWizardPreviewImage>
                    </ProModal>
                )}
            </StepsContainer>
        );
    }

    /**
     * calculate the art step to show based on the amount of keys selected. In case 0 or 1 selected, it returns the first step.
     * In case of maxItems seleced, it returns the last step available.
     */
    getArtStep(): artStep {
        if (this.props.keys.length == this.maxItems) {
            return "last";
        } else {
            return this.props.keys.length == 0
                ? this.props.keys.length
                : this.props.keys.length - 1;
        }
    }

    getKeyMetrics() {
        return (
            _
                // create range of 4
                .range(1, KEY_METRICS_LENGTH + 1)
                // get the translated texts
                .map((index) => i18n(`${this.props.selectedTemplate.keyMetrics}${index}`, {}, ""))
                // filter out empty translations
                .filter((text) => text)
                // convert to components
                .map((text, index) => <StepListItem key={index}>{text}</StepListItem>)
        );
    }

    getSubmitButton() {
        const isCtaDisabled =
            this.state.title.trim() === "" || this.props.keys.length < (this.minItems || 1);
        const button = (
            <Button
                isDisabled={isCtaDisabled}
                isLoading={this.state.loading}
                onClick={this.createDashboard}
                type="primary"
            >
                <ButtonLabel>
                    <I18n>home.dashboards.wizard.template_config.right.pane.CTA</I18n>
                </ButtonLabel>
            </Button>
        );

        if (isCtaDisabled) {
            return (
                <PlainTooltip
                    tooltipContent={i18n("dashboard.templates.disabled.submit.button.tooltip")}
                    placement="top"
                >
                    <span>{button}</span>
                </PlainTooltip>
            );
        } else {
            return button;
        }
    }
}

function mapDispatchToProps(dispatch) {
    return {
        setSideNavItems: () => {
            dispatch(setSharedWithMeDashboards());
        },
        clearSelectedTemplate: () => {
            dispatch(clearSelectedTemplate());
        },
        addKey: (key) => {
            dispatch(templateAddKey(key));
        },
        removeKey: (key) => {
            dispatch(templateRemoveKey(key));
        },
        changeCountry: (country) => {
            dispatch(templateChangeCountry(country));
        },
    };
}

function mapStateToProps({ customDashboard: { dashboardTemplate } }) {
    return {
        selectedTemplate: DashboardTemplateService.getTemplateById(
            dashboardTemplate.selectedTemplate,
        ),
        country: dashboardTemplate.country,
        keys: dashboardTemplate.keys,
        parentType: dashboardTemplate.parentType,
        parentId: dashboardTemplate.parentId,
        originType: dashboardTemplate.originType,
        originId: dashboardTemplate.originId,
    };
}

let connectedComponent = connect(mapStateToProps, mapDispatchToProps)(DashboardTemplatesConfig);

SWReactRootComponent(connectedComponent, "DashboardTemplatesConfig");

export default connectedComponent;
