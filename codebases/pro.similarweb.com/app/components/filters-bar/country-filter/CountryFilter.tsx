import "@similarweb/icons/dist/countries/generated/icons.data.svg.css";
import {
    CountryDropdownItem,
    Dropdown,
    DropdownButton,
    ICountryDropdownItem,
} from "@similarweb/ui-components/dist/dropdown";
import * as classNames from "classnames";
import { swSettings } from "common/services/swSettings";
import WithTrack from "components/WithTrack/src/WithTrack";
import * as _ from "lodash";
import * as React from "react";
import { ComponentType, FC, useCallback } from "react";
import { openUnlockModalV2, openUnlockModal } from "services/ModalService";
import TrialService from "services/TrialService";
import LocationService from "../../../../.pro-features/components/Modals/src/UnlockModal/LocationService";
import TrialHook from "../../React/TrialHook/TrialHook";
import { CountryFilterStyledWrapper } from "./StyledComponent";

export interface ICountryFilterProps {
    availableCountries: ICountryDropdownItem[];
    changeCountry: (itemId: number) => void;
    selectedCountryIds: object;
    height?: number | string;
    width?: number | string;
    disabled?: boolean;
    onToggle?: (isOpen: boolean) => void;
    appendTo?: string;
    dropdownPopupPlacement?: string;
    dropdownPopupWidth?: number | string;
    cssClassContainer?: string;
    itemWrapper?: ComponentType<any>;
    renderButtonComponent?(selectedCountry: object): React.ReactNode;
}

const CountryDropdownItemProxy: FC<ICountryDropdownItem> = ({
    permitted,
    onClick,
    text,
    ...props
}) => (
    <WithTrack>
        {(track) => (
            <CountryDropdownItem
                {...props}
                onClick={useCallback(
                    (event) => {
                        track(
                            "Drop Down",
                            "click",
                            `country/${text}/${permitted ? "open" : "locked"}`,
                        );

                        if (permitted) {
                            onClick(event);
                        }
                    },
                    [permitted, onClick],
                )}
                text={text}
                permitted={permitted}
                isClickAllowed={true}
            />
        )}
    </WithTrack>
);

export const CountryFilter: React.FC<ICountryFilterProps> = (props) => {
    const isTrial =
        new TrialService().isTrial() || swSettings.components.Home.resources.IsNoTouchUser;
    const selectedId = parseInt(Object.keys(props.selectedCountryIds)[0], 10);
    const selectedItem: any = _.find(props.availableCountries, { id: selectedId });
    const selectedText = selectedItem.text;
    const button =
        typeof props.renderButtonComponent === "function"
            ? props.renderButtonComponent(selectedItem)
            : createButton(
                  selectedId,
                  selectedText,
                  props.width,
                  props.height,
                  props.disabled,
                  selectedItem.parent,
              );
    const countriesItems = props.availableCountries.map((country, index) => {
        return {
            ...country,
            key: index,
        };
    });
    const contents = [button, ...countriesItems];

    return (
        <Dropdown
            disabled={props.disabled}
            appendTo={props.appendTo}
            onClick={props.changeCountry}
            onToggle={props.onToggle}
            selectedIds={props.selectedCountryIds}
            itemsComponent={CountryDropdownItemProxy}
            width={props.dropdownPopupWidth}
            dropdownPopupHeight={240}
            hasSearch
            closeOnItemClick
            shouldScrollToSelected
            dropdownPopupMinScrollHeight={48}
            cssClassContainer={classNames(
                "DropdownContent-container",
                "FiltersBarDropdown",
                props.cssClassContainer,
                isTrial && "FiltersBarDropdown--trial",
            )}
            itemWrapper={props.itemWrapper}
            dropdownPopupPlacement={props.dropdownPopupPlacement}
            footerComponent={() => {
                return !isTrial ? null : (
                    <TrialHook
                        text="trial_hook.country.text"
                        buttonText="trial_hook.country.button.text"
                        label="Country Filter"
                        onCtaClick={() => {
                            if (swSettings.user.hasSolution2) {
                                openUnlockModalV2("WebCountry");
                            } else {
                                openUnlockModal(
                                    {
                                        modal: "CountryFilters",
                                    },
                                    `${LocationService.getCurrentLocation()}/Country Filter/get in touch`,
                                );
                            }
                        }}
                    />
                );
            }}
        >
            {contents}
        </Dropdown>
    );
};
CountryFilter.defaultProps = {
    height: 70,
    width: 192,
    disabled: false,
    onToggle: (isOpen: boolean) => null,
    dropdownPopupPlacement: "bottom-left",
    dropdownPopupWidth: 320,
    cssClassContainer: "",
    appendTo: "body",
};
CountryFilter.displayName = "CountryFilter";

function createButton(id, text, width, height, disabled, parentId?) {
    const countryId = parentId ? parentId : id;
    const classnames = classNames("CountryFilter-dropdownButton-icon", `country-icon-${countryId}`);
    return (
        <CountryFilterStyledWrapper key="button">
            <DropdownButton
                key={0}
                width={width}
                height={height}
                cssClass="DropdownButton--filtersBarDropdownButton DropdownButton--filtersBarDropdownButton--country"
                disabled={disabled}
            >
                <div className="CountryFilter-dropdownButton">
                    <div className={classnames} />
                    <div className="CountryFilter-dropdownButton-text">{text}</div>
                </div>
            </DropdownButton>
        </CountryFilterStyledWrapper>
    );
}
