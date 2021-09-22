import { Dropdown } from "@similarweb/ui-components/dist/dropdown";
import { IconSidebarItem } from "@similarweb/ui-components/dist/icon-sidebar";
import React from "react";
import styled from "styled-components";
import { colorsPalettes } from "@similarweb/styles";
import {
    UserSettingsDropDownItem,
    UserSettingsDropDownLink,
} from "../UserSettingDropdown/UserSettingDropdown";
import { PrimaryNavOverrideMode } from "reducers/_reducers/primaryNavOverrideReducer";
import { i18nFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";

interface IPrimaryNavOverrideDropdownProps {
    itemClicked: (mode: PrimaryNavOverrideMode) => void;
    onClick: () => void;
    onToggle: (isOpen: boolean, isOutsideClick: boolean, e: MouseEvent) => void;
    currentlySelectedMode: PrimaryNavOverrideMode;
}

interface IPrimaryNavOverrideModeItemProps {
    isSelected: boolean;
}

const PrimaryNavOverrideModeItem = styled(UserSettingsDropDownItem)<
    IPrimaryNavOverrideModeItemProps
>`
    background-color: ${(props) =>
        props.isSelected ? colorsPalettes.navigation.ACTIVE_TILE_CLICKED : "transparent"};
`;

const i18n = i18nFilter();
const trackSwitch = (selectedMode: PrimaryNavOverrideMode) => {
    TrackWithGuidService.trackWithGuid("nav_override.switch", "click", { selection: selectedMode });
};

const PrimaryNavOverrideDropdown: React.FC<IPrimaryNavOverrideDropdownProps> = (
    props,
): JSX.Element => {
    const dropdownClasses = "DropdownContent-container UserSettingsDropDownContent-container";

    const getDropdownContent = (currentMode: PrimaryNavOverrideMode): JSX.Element[] => {
        return [
            <PrimaryNavOverrideModeItem
                key="S2"
                isSelected={currentMode === PrimaryNavOverrideMode.S2}
            >
                <UserSettingsDropDownLink
                    preventDefault={true}
                    onClick={() => {
                        trackSwitch(PrimaryNavOverrideMode.S2);
                        props.itemClicked(PrimaryNavOverrideMode.S2);
                    }}
                >
                    {i18n("primarynavoverride.options.s2")}
                </UserSettingsDropDownLink>
            </PrimaryNavOverrideModeItem>,
            <PrimaryNavOverrideModeItem
                key="S1"
                isSelected={currentMode === PrimaryNavOverrideMode.S1}
            >
                <UserSettingsDropDownLink
                    preventDefault={true}
                    onClick={() => {
                        trackSwitch(PrimaryNavOverrideMode.S1);
                        props.itemClicked(PrimaryNavOverrideMode.S1);
                    }}
                >
                    {i18n("primarynavoverride.options.s1")}
                </UserSettingsDropDownLink>
            </PrimaryNavOverrideModeItem>,
            <PrimaryNavOverrideModeItem
                key="Legacy"
                isSelected={currentMode === PrimaryNavOverrideMode.Legacy}
            >
                <UserSettingsDropDownLink
                    preventDefault={true}
                    onClick={() => {
                        trackSwitch(PrimaryNavOverrideMode.Legacy);
                        props.itemClicked(PrimaryNavOverrideMode.Legacy);
                    }}
                >
                    {i18n("primarynavoverride.options.legacy")}
                </UserSettingsDropDownLink>
            </PrimaryNavOverrideModeItem>,
        ];
    };

    return (
        <Dropdown
            width={270}
            dropdownPopupHeight={400}
            buttonWidth={"auto"}
            appendTo={"body"}
            onClick={props.onClick}
            onToggle={props.onToggle}
            dropdownPopupPlacement="right"
            cssClassContainer={dropdownClasses}
        >
            {[
                <IconSidebarItem
                    key="primary-nav-override"
                    icon={"burger"}
                    title={i18n("primarynavoverride.label")}
                />,
                ...getDropdownContent(props.currentlySelectedMode),
            ]}
        </Dropdown>
    );
};

export default PrimaryNavOverrideDropdown;
