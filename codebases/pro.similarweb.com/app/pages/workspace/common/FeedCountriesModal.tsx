import { colorsPalettes } from "@similarweb/styles";
import { Button, IconButton } from "@similarweb/ui-components/dist/button";

import { CountryChipItem } from "@similarweb/ui-components/dist/chip";

import {
    Dropdown,
    DropdownButton,
    MultiSelectCountryDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import React from "react";
import { allTrackers } from "services/track/track";
import styled, { css } from "styled-components";
import { FlexColumn } from "../../../../.pro-features/styled components/StyledFlex/src/StyledFlex";
import { getCountries } from "../../../components/filters-bar/utils";
import { i18nFilter } from "../../../filters/ngFilters";
import { LeadGeneratorChipsWrapper } from "../../lead-generator/components/elements";

export interface IFeedCountriesModalProps {
    feedCountries: number[];

    onSave(countries: number[]);

    onCancel();
}

export interface IFeedCountriesModalState {
    selectedCountries: { [k: string]: string };
    allCountries: Array<{ id: number; text: string }>;
}

const Container = styled(FlexColumn)`
    padding: 24px;
    flex-grow: 1;
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    font-size: 16px;
    color: ${colorsPalettes.carbon[500]};
`;

const SelectedCountriesContainer = styled.div<{ hasValue: boolean }>`
    display: flex;
    flex-wrap: wrap;
    max-height: 170px;
    overflow: auto;
    ${(props) =>
        props.hasValue &&
        css`
            margin-bottom: 16px;
            padding-bottom: 6px;
            border-bottom: 1px solid #eceef0;
        `};
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
    align-items: flex-end;
    padding-top: 40px;
`;

export class FeedCountriesModal extends React.Component<
    IFeedCountriesModalProps,
    IFeedCountriesModalState
> {
    public state: IFeedCountriesModalState = {
        allCountries: getCountries(),
        selectedCountries: this.props.feedCountries.reduce(
            (all, country) => ({ ...all, [country]: true }),
            {},
        ),
    };
    private dropDownRef = null;

    public getCountryItems = () => {
        return getCountries().map(({ id, text }) => {
            return (
                <MultiSelectCountryDropdownItem
                    selected={!!this.state.selectedCountries[id]}
                    onClick={(id) => this.onCountryItemClicked(id)}
                    key={id}
                    id={id}
                    text={text}
                />
            );
        });
    };

    public getCountryChipsItems = () => {
        const { selectedCountries } = this.state;
        return this.state.allCountries.reduce((selectedCountriesChipItems, { id, text }) => {
            if (selectedCountries[id]) {
                return [
                    ...selectedCountriesChipItems,
                    <CountryChipItem
                        key={id}
                        id={id}
                        text={text}
                        onCloseItem={() => this.removeCountry(id)}
                    />,
                ];
            } else {
                return selectedCountriesChipItems;
            }
        }, []);
    };

    public onCountryItemClicked = ({ id }) => {
        const isSelected = this.state.selectedCountries[id];
        const { selectedCountries } = this.state;
        if (!isSelected) {
            allTrackers.trackEvent("list modal setting", "add", "Country");
            return this.setState(
                {
                    selectedCountries: {
                        ...selectedCountries,
                        [id]: true,
                    },
                },
                () => {
                    requestAnimationFrame(() => {
                        try {
                            this.dropDownRef.popupClickRef.reposition();
                        } catch (e) {}
                    });
                },
            );
        }
        return this.removeCountry(id);
    };

    public removeCountry = (countryCode) => {
        allTrackers.trackEvent("list modal setting", "remove", "Country");
        const { [countryCode]: countryToRemove, ...countriesToStay } = this.state.selectedCountries;
        this.setState(
            {
                selectedCountries: countriesToStay,
            },
            () => {
                requestAnimationFrame(() => {
                    try {
                        this.dropDownRef.popupClickRef.reposition();
                    } catch (e) {}
                });
            },
        );
    };

    public getFinalDropDownProps = () => ({
        selectedIds: this.state.selectedCountries,
        hasSearch: true,
        onClick: this.onCountryItemClicked,
        closeOnItemClick: false,
        searchPlaceHolder: i18nFilter()("workspaces.feed.modal.countries.search-countries"),
        dropdownPopupPlacement: "ontop-left",
        dropdownPopupMinScrollHeight: 48,
        dropdownPopupHeight: 432,
        ref: (ref) => (this.dropDownRef = ref),
    });

    public onBack = () => {
        allTrackers.trackEvent("list modal setting", "Back", "Country");
        this.props.onCancel();
    };

    public onCancel = () => {
        allTrackers.trackEvent("list modal setting", "close", "Country");
        this.props.onCancel();
    };

    public onSave = () => {
        allTrackers.trackEvent("list modal setting", "Submit-ok", "Country");
        this.props.onSave(Object.keys(this.state.selectedCountries).map((code) => +code));
    };

    public render() {
        const countriesChipItems = this.getCountryChipsItems();
        return (
            <Container>
                <Header>
                    <IconButton type={"flat"} iconName={"arrow-left"} onClick={this.onBack} />
                    <span>{i18nFilter()("workspaces.feed.modal.countries.title")}</span>
                </Header>
                <LeadGeneratorChipsWrapper showBorder={countriesChipItems.length > 0}>
                    <SelectedCountriesContainer hasValue={countriesChipItems.length > 0}>
                        {countriesChipItems}
                    </SelectedCountriesContainer>
                    <Dropdown key={"feedCountriesDropdown"} {...this.getFinalDropDownProps()}>
                        {[
                            <DropdownButton key="DropdownButton1">
                                {i18nFilter()("workspaces.feed.modal.countries.search-countries")}
                            </DropdownButton>,
                            ...this.getCountryItems(),
                        ]}
                    </Dropdown>
                </LeadGeneratorChipsWrapper>
                <ButtonsContainer>
                    <Button type={"flat"} buttonHtmlType={"button"} onClick={this.onCancel}>
                        {i18nFilter()("global.cancel")}
                    </Button>
                    <Button buttonHtmlType={"button"} onClick={this.onSave}>
                        {i18nFilter()("global.save")}
                    </Button>
                </ButtonsContainer>
            </Container>
        );
    }
}
