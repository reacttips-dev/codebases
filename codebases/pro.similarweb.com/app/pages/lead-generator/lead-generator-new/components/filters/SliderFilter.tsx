import * as React from "react";
import { StatelessComponent } from "react";
import { ISliderFilterProps } from "./types";
import { SliderFixedValues } from "@similarweb/ui-components/dist/slider";
import { i18nFilter } from "filters/ngFilters";
import { LeadGeneratorFilter } from "../elements";
import { DefaultSummary } from "../summary/DefaultSummary";
import * as numeral from "numeral";
import * as _ from "lodash";

export function getSliderSubtitle(serverValue, title) {
    return i18nFilter()(title, { numberOf: numeral(serverValue).format("0,0").toString() });
}

export function getSliderDescription(crrValue) {
    return numeral(crrValue).format("0,0").toString();
}

export const SliderSummaryFilter: StatelessComponent<ISliderFilterProps> = ({ filter }) => {
    return (
        <DefaultSummary
            title={filter.title}
            description={getSliderDescription(filter.getValue())}
        />
    );
};

export const SliderBoxFilter: StatelessComponent<ISliderFilterProps> = ({
    filter,
    setBoxActive,
}) => {
    const setServerValue = (value) => {
        filter.setValue({
            [filter.stateName]: value,
        });
        setBoxActive(true);
    };

    const getClientValue = () => {
        return filter.getValue();
    };

    return (
        <LeadGeneratorFilter>
            <SliderFixedValues
                fixedValues={filter.numberOptions}
                value={getClientValue()}
                onChange={setServerValue}
                title={i18nFilter()(filter.title)}
                description={getSliderDescription(filter.getValue())}
                markInit={true}
                dataAutomation={`lead-generator-slider-${_.kebabCase(filter.stateName)}`}
            />
        </LeadGeneratorFilter>
    );
};
