import {
    CategoryDropdownButton,
    CategoryDropdownItem,
    CountryDropdownButton,
    CountryDropdownItem,
    CustomCategoryDropdownItem,
    Dropdown,
} from "@similarweb/ui-components/dist/dropdown";
import * as classNames from "classnames";
import categoryService from "common/services/categoryService";
import { swSettings } from "common/services/swSettings";
import { CategoryDropdown } from "components/React/CategoriesDropdown/CategoryDropdown";
import ContactUsItemWrap from "components/React/ContactUs/ContactUsItemWrap";
import { SettingsBox } from "components/React/SettingsBox/SettingsBox";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { PureComponent } from "react";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import { BoxStates, trackEvents } from "../../pageDefaults";

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
        const countries = this._swSettings.components.IndustryAnalysis.allowedCountries;
        const selectedCountry = countries.find((item) => item.id === this.state.country);
        const canSave = !!(selectedCountry && categories.length);
        const countriesContent = [
            <CountryDropdownButton key="CountryButton1" countryId={selectedCountry.id}>
                {selectedCountry.text}
            </CountryDropdownButton>,
            ...countries,
        ];

        return (
            <SettingsBox {...this.getSettingsProps()} canSave={canSave}>
                <CategoryDropdown
                    selectedCategoryId={this.state.category}
                    searchPlaceHolder={i18nFilter()("appcategory.filters.category.placeholder")}
                    onSelect={this.changeCategory}
                    onToggle={(isOpen) => this.onToggle(isOpen, "category_filter")}
                />
                <Dropdown
                    selectedIds={{ [this.state.country]: true }}
                    shouldScrollToSelected={true}
                    hasSearch={true}
                    itemsComponent={CountryDropdownItem}
                    buttonWidth={196}
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
        return [
            ...UserCustomCategoryService.getCustomCategories(),
            ...categoryService.getCategories(),
        ];
    };
}
