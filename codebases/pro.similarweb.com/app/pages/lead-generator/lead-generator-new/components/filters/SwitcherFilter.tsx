import * as React from "react";
import { StatelessComponent } from "react";
import { ISwitcherFilterProps } from "./types";
import { Switcher, TextSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import { i18nFilter } from "filters/ngFilters";
import { allTrackers } from "../../../../../services/track/track";
import { SwitcherContainer, SwitcherTitle } from "../elements";
import I18n from "../../../../../components/React/Filters/I18n";
import { DefaultSummary } from "../summary/DefaultSummary";

export function getSwitcherSubtitle(serverValue, title) {
    const i18nValue = i18nFilter()(title, { type: serverValue.split("_").join(" ") });
    return i18nValue || serverValue;
}

export const SwitcherSummaryFilter: StatelessComponent<ISwitcherFilterProps> = ({ filter }) => {
    return (
        <DefaultSummary
            title={filter.title}
            description={filter.textOptions.find(
                (item) => item === `${filter.title}.${filter.getValue()}`,
            )}
        />
    );
};

export const SwitcherBoxFilter: StatelessComponent<ISwitcherFilterProps> = ({
    filter,
    setBoxActive,
}) => {
    const setServerValue = (value) => {
        filter.setValue({
            [filter.stateName]: filter.textOptions[value].split(".").pop(),
        });
        setBoxActive(true);
        allTrackers.trackEvent(
            "Capsule Button",
            "switch",
            `Sort by/${i18nFilter()(filter.textOptions[value])}`,
        );
    };

    const getClientValue = () => {
        return filter.textOptions.findIndex(
            (item) => item === `${filter.title}.${filter.getValue()}`,
        );
    };

    return (
        <SwitcherContainer>
            <SwitcherTitle>
                <I18n>{filter.title}</I18n>
            </SwitcherTitle>
            <Switcher
                selectedIndex={getClientValue()}
                customClass="TextSwitcher"
                onItemClick={setServerValue}
            >
                {filter.textOptions.map((item) => (
                    <TextSwitcherItem key={`${item}SWITCHER`}>
                        {i18nFilter()(item)}
                    </TextSwitcherItem>
                ))}
            </Switcher>
        </SwitcherContainer>
    );
};
