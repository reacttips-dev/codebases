import { swSettings } from "common/services/swSettings";
import * as React from "react";
import { PureComponent } from "react";
import { Injector } from "common/ioc/Injector";
import { i18nFilter } from "filters/ngFilters";
import {
    Dropdown,
    CountryDropdownButton,
    CountryDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import { SettingsBox } from "components/React/SettingsBox/SettingsBox";
import { BoxStates, trackEvents } from "../../pageDefaults";
import * as classNames from "classnames";
import ContactUsItemWrap from "components/React/ContactUs/ContactUsItemWrap";

export class Settings extends PureComponent<any, any> {
    private _swSettings: any;
    private originalCountry: number;

    constructor(props, context) {
        super(props, context);
        this._swSettings = swSettings;
        this.originalCountry = Number(this.props.filters.country);
        this.state = {
            country: this.originalCountry,
        };
    }

    render() {
        const countries = this._swSettings.components.KeywordAnalysis.allowedCountries;
        const selectedCountry = countries.find((item) => item.id === this.state.country);
        const canSave = !!selectedCountry;
        const contents = [
            <CountryDropdownButton key="CountryButton1" countryId={selectedCountry.id}>
                {selectedCountry.text}
            </CountryDropdownButton>,
            ...countries,
        ];

        return (
            <SettingsBox {...this.getSettingsProps()} canSave={canSave}>
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
                    {contents}
                </Dropdown>
            </SettingsBox>
        );
    }

    getSettingsProps = () => {
        const { toggleSettings, resourceName, isFlipping, prevState } = this.props;
        return {
            title: i18nFilter()("research.homepage.settings.title1"),
            boxClass: classNames("Box--researchHomepage", { "flip-settings-reverse": isFlipping }),
            onSave: this.saveFilters,
            onClose: () => toggleSettings(resourceName, BoxStates.SETTINGS, prevState),
        };
    };

    onToggle = (isOpen, filterName) => {
        isOpen && trackEvents(this.props.resourceName, "Drop Down", "open", filterName);
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
        if (this.state.country === this.originalCountry) {
            this.props.toggleSettings(
                this.props.resourceName,
                BoxStates.SETTINGS,
                this.props.prevState,
            );
        } else {
            this.props.onFiltersChange(this.props.resourceName, this.state.country);
        }
    };
}
