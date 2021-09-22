import ContactUsLink from "components/React/ContactUs/ContactUsLink";
import * as React from "react";
import { DropdownContainer } from "./DropdownContainer";
import { CountryDropdownItem, DropdownButton } from "@similarweb/ui-components/dist/dropdown";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import I18n from "components/React/Filters/I18n";
import { allTrackers } from "services/track/track";
import ContactUsItemWrap from "components/React/ContactUs/ContactUsItemWrap";

export interface DashboardWizardCountryProps {
    availableCountries: any[];
    changeCountry: (itemId: number) => void;
    selectedCountryId: number;
    titleComponent?: JSX.Element;
}

const DashboardWizardCountry: React.StatelessComponent<DashboardWizardCountryProps> = ({
    availableCountries,
    changeCountry,
    selectedCountryId,
    titleComponent,
}) => {
    const countriesItems = [];
    availableCountries.forEach((country: any, index) => {
        const { id: countyId } = country;
        const countyIdAsNumber = Number(countyId);
        countriesItems.push({
            ...country,
            id: countyIdAsNumber === NaN ? countyId : countyIdAsNumber,
            key: index,
        });
    });
    const contactFormIsVisible = availableCountries.length === 1;
    const contents = [
        <DropdownButton key={Date.now()}>
            <I18n>home.dashboards.wizard.country.dropdown</I18n>
        </DropdownButton>,
        ...countriesItems,
    ];
    const onSelect = (item) => {
        allTrackers.trackEvent("Drop Down", "click", `Country/${item.text}`);
        changeCountry(item.id);
    };
    if (contactFormIsVisible) {
        contents.push(
            <div key="last-item" id="lastitem" className="DropdownItem u-flex-row">
                <ContactUsLink label="Country">
                    <I18n>demo.dropdown.message</I18n>
                </ContactUsLink>
            </div>,
        );
    }
    return (
        <div className="country">
            {titleComponent}
            <DropdownContainer
                initialSelection={{ [selectedCountryId]: true }}
                hasSearch={!contactFormIsVisible}
                itemsComponent={CountryDropdownItem}
                onSelect={onSelect}
                dropdownPopupHeight={150}
                showCountryFlag={true}
                itemWrapper={ContactUsItemWrap}
            >
                {contents}
            </DropdownContainer>
        </div>
    );
};

SWReactRootComponent(DashboardWizardCountry, "DashboardWizardCountry");

export default DashboardWizardCountry;
