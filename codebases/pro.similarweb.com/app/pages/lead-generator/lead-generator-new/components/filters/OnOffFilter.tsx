import * as React from "react";
import { StatelessComponent } from "react";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import { IBoxFilterProps } from "./types";
import { OnlyTitleSummary } from "../summary/OnlyTitleSummary";
import { i18nFilter } from "../../../../../filters/ngFilters";

export function getOnOffSubtitle(title) {
    return i18nFilter()(title);
}

export const OnOffSummaryFilter: StatelessComponent<IBoxFilterProps> = ({ filter }) => {
    return <OnlyTitleSummary title={filter.title} />;
};

export const OnOffBoxFilter: StatelessComponent<IBoxFilterProps> = ({ filter, setBoxActive }) => {
    const setServerValue = () => {
        filter.setValue({
            [filter.stateName]: !filter.getValue(),
        });
        setBoxActive(true);
    };

    const getClientValue = () => {
        return filter.getValue();
    };

    return <OnOffSwitch isSelected={getClientValue()} onClick={setServerValue} />;
};
