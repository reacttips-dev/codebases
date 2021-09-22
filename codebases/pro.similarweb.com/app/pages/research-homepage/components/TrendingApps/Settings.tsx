import { swSettings } from "common/services/swSettings";
import * as React from "react";
import { PureComponent } from "react";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import { SettingsBox } from "components/React/SettingsBox/SettingsBox";
import { Switcher, TubeSwitcherItem } from "@similarweb/ui-components/dist/switcher";

import {
    Dropdown,
    DropdownButton,
    CountryDropdownButton,
    SimpleDropdownItem,
    CountryDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { fetchKeywordsCategories } from "../../pageResources";
import { BoxStates, trackEvents } from "../../pageDefaults";
import * as classNames from "classnames";
import { SWReactIcons } from "@similarweb/icons";
import ContactUsItemWrap from "components/React/ContactUs/ContactUsItemWrap";
import styled, { css } from "styled-components";

import { colorsPalettes, rgba } from "@similarweb/styles";

const TubeSwitcherItemIconStyled = styled(SWReactIcons)<{ iconName?: string }>`
    padding-right: 8px;
    display: flex;
    svg {
        width: 16px;
        height: 16px;
    }
    path {
        fill: ${rgba(colorsPalettes.carbon[400], 0.5)};
    }
`;

const TubeSwitcherItemStyled = styled(TubeSwitcherItem)`
    width: 95px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: ${rgba(colorsPalettes.carbon[400], 0.5)};
    background-color: ${colorsPalettes.bluegrey[200]};
    &:hover {
        color: inherit;
        ${TubeSwitcherItemIconStyled} {
            path {
                fill: ${colorsPalettes.carbon[400]};
            }
        }
    }
    ${({ selected }) =>
        selected &&
        css`
            background-color: ${colorsPalettes.bluegrey[100]};
            color: ${colorsPalettes.carbon[400]};
            ${TubeSwitcherItemIconStyled} {
                path {
                    fill: ${colorsPalettes.carbon[400]};
                }
            }
        `};
`;

export class Settings extends PureComponent<any, any> {
    private _swSettings: any;
    private originalStore: number;
    private originalCategory: string;
    private originalCountry: number;
    private stores = ["Apple", "Google"];
    private metrics = {
        Apple: "AppEngagementOverviewIOSTrending",
        Google: "AppEngagementOverviewAndroidTrending",
    };
    private categories: any = [];
    private categoriesResponse: any = {};

    constructor(props, context) {
        super(props, context);
        this._swSettings = swSettings;
        this.originalStore = this.stores.indexOf(this.props.filters.store);
        this.originalCategory = this.props.filters.category;
        this.originalCountry = Number(this.props.filters.country);
        this.state = {
            store: this.originalStore,
            category: this.originalCategory,
            country: this.originalCountry,
        };
    }

    componentDidMount() {
        this.fetchCategories();
    }

    render() {
        const categoriesObj = this.getCategories();
        const countries = this._swSettings.components[this.metrics[this.stores[this.state.store]]]
            .allowedCountries;
        const selectedCountry =
            this.stores[this.state.store] === "Apple"
                ? countries[0]
                : countries.find((item) => item.id === this.state.country);
        const selectedCategory = this.categories.find((item) => item.id === this.state.category);
        const canSave = !!(selectedCountry && selectedCategory);
        const categoriesContent = [categoriesObj.ButtonElement, ...categoriesObj.elements];
        const countriesContent = [
            selectedCountry ? (
                <CountryDropdownButton key="CountryButton1" countryId={selectedCountry.id}>
                    {selectedCountry.text}
                </CountryDropdownButton>
            ) : (
                <DropdownButton key="countryBtn">Select a Country</DropdownButton>
            ),
            ...countries,
        ];

        return (
            <SettingsBox {...this.getSettingsProps()} canSave={canSave}>
                <Switcher
                    selectedIndex={this.state.store}
                    customClass="TubeSwitcher"
                    onItemClick={this.changeStore}
                >
                    <TubeSwitcherItemStyled>
                        <TubeSwitcherItemIconStyled iconName="i-tunes" /> IOS
                    </TubeSwitcherItemStyled>
                    <TubeSwitcherItemStyled>
                        <TubeSwitcherItemIconStyled iconName="google-play" /> Android
                    </TubeSwitcherItemStyled>
                </Switcher>
                <Dropdown
                    selectedIds={{ [this.state.category]: true }}
                    shouldScrollToSelected={true}
                    hasSearch={true}
                    buttonWidth={196}
                    scrollAreaMinHeight={180}
                    dropdownPopupHeight={180}
                    onClick={
                        !categoriesObj.elements.length ? this.fetchCategories : this.changeCategory
                    }
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
                    dropdownPopupMinScrollHeight={60}
                    scrollAreaMinHeight={180}
                    dropdownPopupHeight={180}
                    buttonWidth={196}
                    dropdownPopupPlacement="top"
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
            title: i18nFilter()("research.homepage.settings.title3"),
            boxClass: classNames("Box--researchHomepage", { "flip-settings-reverse": isFlipping }),
            onSave: this.saveFilters,
            onClose: () => toggleSettings(resourceName, BoxStates.SETTINGS, prevState),
        };
    };

    onToggle = (isOpen, filterName) => {
        isOpen && trackEvents(this.props.resourceName, "Drop Down", "open", filterName);
    };

    changeStore = (index) => {
        const countries = this._swSettings.components[this.metrics[this.stores[index]]]
            .allowedCountries;
        this.setCategories(this.stores[index]);
        this.setState({
            store: index,
            country: this.stores[index] === "Apple" ? countries[0].id : this.state.country,
        });
        trackEvents(this.props.resourceName, "toggle", "switch", this.stores[index]);
    };

    changeCategory = (category) => {
        this.setState({
            category: category.id,
            selectedIdsCategory: {
                [category.id]: true,
            },
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
            this.state.store === this.originalStore &&
            this.state.category === this.originalCategory &&
            this.state.country === this.originalCountry
        ) {
            this.props.toggleSettings(
                this.props.resourceName,
                BoxStates.SETTINGS,
                this.props.prevState,
            );
        } else {
            const devices = { Google: "AndroidPhone", Apple: "iPhone" };
            this.props.onFiltersChange(
                this.props.resourceName,
                this.state.country,
                this.state.category,
                this.stores[this.state.store],
                devices[this.stores[this.state.store]],
            );
        }
    };

    setCategories = (store?) => {
        if ((store || this.stores[this.state.store]) === "Apple") {
            this.categories =
                this.categoriesResponse.Apple && this.categoriesResponse.Apple.iPhone.Categories;
        } else {
            this.categories =
                this.categoriesResponse.Google &&
                this.categoriesResponse.Google.AndroidPhone.Categories;
        }
    };

    fetchCategories = async () => {
        const response = await fetchKeywordsCategories();
        this.categoriesResponse = response.payload;

        if (response.success) {
            this.setCategories();
            this.forceUpdate();
        }
    };

    getCategories = () => {
        let ButtonElement;
        if (!this.categories.length) {
            return {
                ButtonElement: (
                    <DropdownButton key="catBtn" disabled={true}>
                        {this.state.category}
                    </DropdownButton>
                ),
                elements: [],
            };
        }

        const categoriesJSX = this.categories.map((item, idx) => {
            if (this.state.category === item.id) {
                ButtonElement = (
                    <DropdownButton key="catBtn" {...item}>
                        {item.text}
                    </DropdownButton>
                );
            }
            return (
                <SimpleDropdownItem key={`cat${idx}`} {...item}>
                    {item.text}
                </SimpleDropdownItem>
            );
        });

        return {
            ButtonElement: ButtonElement || (
                <DropdownButton key="catBtn">Select a Category</DropdownButton>
            ),
            elements: categoriesJSX,
        };
    };
}
