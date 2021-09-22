import { swSettings } from "common/services/swSettings";
import * as React from "react";
import { PureComponent } from "react";
import categoryService from "common/services/categoryService";
import { i18nFilter } from "filters/ngFilters";
import { SettingsBox } from "components/React/SettingsBox/SettingsBox";
import {
    Dropdown,
    CategoryDropdownButton,
    CountryDropdownButton,
    CustomCategoryDropdownItem,
    CategoryDropdownItem,
    CountryDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { BoxStates, trackEvents } from "../../pageDefaults";
import * as classNames from "classnames";
import ContactUsItemWrap from "components/React/ContactUs/ContactUsItemWrap";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

export class Settings extends PureComponent<any, any> {
    private _swSettings: any;
    private originalCategory: string;
    private originalCountry: number;

    constructor(props, context) {
        super(props, context);
        this._swSettings = swSettings;
        this.originalCategory = this.props.filters.category;
        this.originalCountry = Number(this.props.filters.country);
        this.state = {
            category: this.originalCategory,
            country: this.originalCountry,
        };
    }

    render() {
        const categories = this.getCategories();
        const countries = this._swSettings.components.KeywordAnalysis.allowedCountries;
        const selectedCountry = countries.find((item) => item.id === this.state.country);
        const canSave = !!(selectedCountry && categories.elements.length);
        const categoriesContent = [categories.ButtonElement, ...categories.elements];
        const countriesContent = [
            <CountryDropdownButton key="CountryButton1" countryId={selectedCountry.id}>
                {selectedCountry.text}
            </CountryDropdownButton>,
            ...countries,
        ];

        return (
            <SettingsBox {...this.getSettingsProps()} canSave={canSave}>
                <Dropdown
                    selectedIds={{ [this.state.category]: true }}
                    shouldScrollToSelected={true}
                    hasSearch={true}
                    buttonWidth={196}
                    scrollAreaMinHeight={180}
                    dropdownPopupHeight={180}
                    onClick={this.changeCategory}
                    onToggle={(isOpen) => this.onToggle(isOpen, "category_filter")}
                    searchPlaceHolder={i18nFilter()("appcategory.filters.category.placeholder")}
                >
                    {categoriesContent}
                </Dropdown>
                <Dropdown
                    selectedIds={{ [this.state.country]: true }}
                    shouldScrollToSelected={true}
                    hasSearch={true}
                    itemsComponent={CountryDropdownItem}
                    buttonWidth={196}
                    dropdownPopupMinScrollHeight={60}
                    scrollAreaMinHeight={180}
                    dropdownPopupHeight={180}
                    itemWrapper={ContactUsItemWrap}
                    onClick={this.changeCountry}
                    onToggle={(isOpen) => this.onToggle(isOpen, "country_filter")}
                >
                    {countriesContent}
                </Dropdown>
            </SettingsBox>
        );
    }

    getSettingsProps = () => {
        const { toggleSettings, resourceName, isFlipping, prevState } = this.props;
        return {
            title: i18nFilter()("research.homepage.settings.title2"),
            boxClass: classNames("Box--researchHomepage", { "flip-settings-reverse": isFlipping }),
            onSave: this.saveFilters,
            onClose: () => toggleSettings(resourceName, BoxStates.SETTINGS, prevState),
        };
    };

    onToggle = (isOpen, filterName) => {
        isOpen && trackEvents(this.props.resourceName, "Drop Down", "open", filterName);
    };

    changeCategory = (category) => {
        this.setState({
            category: category.id,
        });
        trackEvents(
            this.props.resourceName,
            "Drop Down",
            "click",
            `category_filter/${category.text}`,
        );
    };

    changeCountry = (country) => {
        this.setState({
            country: country.id,
        });
        trackEvents(
            this.props.resourceName,
            "Drop Down",
            "click",
            `country_filter/${country.text}`,
        );
    };

    saveFilters = () => {
        if (
            this.state.category === this.originalCategory &&
            this.state.country === this.originalCountry
        ) {
            this.props.toggleSettings(
                this.props.resourceName,
                BoxStates.SETTINGS,
                this.props.prevState,
            );
        } else {
            this.props.onFiltersChange(
                this.props.resourceName,
                this.state.country,
                this.state.category,
            );
        }
    };

    getCategories = () => {
        const categoriesJSX = [];
        let ButtonElement;
        UserCustomCategoryService.getCustomCategories()
            .concat(categoryService.getCategories())
            .forEach((item: any, idx) => {
                if (this.state.category === item.id) {
                    ButtonElement = (
                        <CategoryDropdownButton
                            key="catBtn"
                            isCustomCategory={item.isCustomCategory}
                            {...item}
                        />
                    );
                }
                if (item.isCustomCategory) {
                    categoriesJSX.push(
                        <CustomCategoryDropdownItem key={`custcat${idx}`} {...item}>
                            {item.text}
                        </CustomCategoryDropdownItem>,
                    );
                } else {
                    categoriesJSX.push(
                        <CategoryDropdownItem key={`cat${idx}`} {...item}>
                            {item.text}
                        </CategoryDropdownItem>,
                    );
                    if (item.children) {
                        item.children.forEach((item, index) => {
                            if (this.state.category === item.id) {
                                ButtonElement = (
                                    <CategoryDropdownButton
                                        key="catBtn"
                                        cssClass="DropdownButton-category"
                                        isCustomCategory={item.isCustomCategory}
                                        {...item}
                                    />
                                );
                            }
                            categoriesJSX.push(
                                <CategoryDropdownItem
                                    key={`childcat${index}`}
                                    {...item}
                                    isChild={true}
                                >
                                    {item.text}
                                </CategoryDropdownItem>,
                            );
                        });
                    }
                }
            });

        return {
            ButtonElement,
            elements: categoriesJSX,
        };
    };
}
