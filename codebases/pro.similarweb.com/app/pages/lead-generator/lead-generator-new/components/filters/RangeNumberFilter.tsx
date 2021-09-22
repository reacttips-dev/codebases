import { RangeFixedValues } from "@similarweb/ui-components/dist/slider";
import { i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import * as numeral from "numeral";
import * as React from "react";
import { StatelessComponent } from "react";
import LeadGeneratorUtils from "../../../LeadGeneratorUtils";
import { LeadGeneratorFilter } from "../elements";
import { DefaultSummary } from "../summary/DefaultSummary";
import { ISliderFilterProps } from "./types";
import {
    INFINITY_CHARACTER_DECIMAL_CODE,
    RANGE_FILTER_DISPLAYED_VALUE_DELIMITER,
    RANGE_FILTER_LESS_THAN_KEY,
    RANGE_FILTER_MORE_THAN_KEY,
} from "pages/lead-generator/lead-generator-new/constants";
import { MAX_OPTION_VALUE } from "pages/lead-generator/lead-generator-new/filters-options";
import { RangeFilterDisplayedValueMap } from "pages/lead-generator/types/types";
import { useTranslation } from "components/WithTranslation/src/I18n";

export function getRangeNumberSubtitle(serverValue, title, formatter?: (v: string) => string) {
    function prettifyValue(val): string {
        if (parseInt(val) === MAX_OPTION_VALUE) {
            return String.fromCharCode(INFINITY_CHARACTER_DECIMAL_CODE);
        }

        if (typeof formatter !== "undefined") {
            return formatter(val);
        }

        return numeral(val).format("0,0").toString();
    }

    if (serverValue.indexOf(">=") === 0) {
        return i18nFilter()("grow.lead_generator.exist.description.more_than", {
            field: i18nFilter()(title),
            number: prettifyValue(serverValue.replace(">=", "")),
        });
    } else if (serverValue.indexOf("<=") === 0) {
        return i18nFilter()("grow.lead_generator.exist.description.less_than", {
            field: i18nFilter()(title),
            number: prettifyValue(serverValue.replace("<=", "")),
        });
    }
    const values = serverValue.split("...").map((val) => prettifyValue(val));
    return i18nFilter()("grow.lead_generator.exist.description.between", {
        field: i18nFilter()(title),
        from: values[0],
        to: values[1],
    });
}

function formatInitValue(initValue) {
    return initValue.split("...").map((val) => parseInt(val));
}

function formatCrrValue(crrValue, initValue) {
    if (crrValue.includes(">=")) {
        return [parseInt(crrValue.replace(">=", "")), initValue[1]];
    } else if (crrValue.includes("<=")) {
        return [initValue[0], parseInt(crrValue.replace("<=", ""))];
    }
    return crrValue.split("...");
}

function getRangeNumberDescription(
    crrValue,
    initValue,
    formatter?: (value: string | number) => string,
): RangeFilterDisplayedValueMap {
    function prettifyValue(val): string {
        if (val === MAX_OPTION_VALUE.toString()) {
            return String.fromCharCode(INFINITY_CHARACTER_DECIMAL_CODE);
        }

        if (typeof formatter !== "undefined") {
            return formatter(val);
        }

        return numeral(val).format("0,0").toString();
    }

    if (LeadGeneratorUtils.isOnlyFirstChanged(crrValue, initValue)) {
        return {
            key: RANGE_FILTER_MORE_THAN_KEY,
            value: prettifyValue(crrValue[0]),
        };
    }

    if (LeadGeneratorUtils.isOnlySecondChanged(crrValue, initValue)) {
        return {
            key: RANGE_FILTER_LESS_THAN_KEY,
            value: prettifyValue(crrValue[1]),
        };
    }

    return {
        value: crrValue.map(prettifyValue).join(` ${RANGE_FILTER_DISPLAYED_VALUE_DELIMITER} `),
    };
}

export const RangeNumberSummaryFilter: StatelessComponent<ISliderFilterProps> = ({ filter }) => {
    const translate = useTranslation();
    const initValue = formatInitValue(filter.initValue);
    const crrValue = formatCrrValue(filter.getValue(), initValue);
    const { key, value } = getRangeNumberDescription(crrValue, initValue, filter.formatDescription);
    const description = typeof key === "undefined" ? value : translate(key, { number: value });

    return <DefaultSummary title={filter.title} description={description} />;
};

export const RangeNumberBoxFilter: StatelessComponent<ISliderFilterProps> = ({
    filter,
    setBoxActive,
}) => {
    const translate = useTranslation();

    const setServerValue = (crrValue) => {
        let serverValue;
        const initValue = filter.initValue.split("...").map((val) => parseInt(val));
        if (LeadGeneratorUtils.isOnlyFirstChanged(crrValue, initValue)) {
            serverValue = `>=${crrValue[0]}`;
        } else if (LeadGeneratorUtils.isOnlySecondChanged(crrValue, initValue)) {
            serverValue = `<=${crrValue[1]}`;
        } else {
            serverValue = crrValue.join("...");
        }
        filter.setValue({
            [filter.stateName]: serverValue,
        });
        setBoxActive(true);
    };

    const getClientValue = () => {
        const crrValue = filter.getValue();
        if (crrValue.includes(">=")) {
            return [
                parseInt(crrValue.replace(">=", "")),
                filter.numberOptions[filter.numberOptions.length - 1],
            ];
        } else if (crrValue.includes("<=")) {
            return [filter.numberOptions[0], parseInt(crrValue.replace("<=", ""))];
        }
        return crrValue.split("...").map((val) => parseInt(val));
    };

    const initValue = formatInitValue(filter.initValue);
    const crrValue = formatCrrValue(filter.getValue(), initValue);

    const { key, value } = getRangeNumberDescription(crrValue, initValue, filter.formatDescription);
    const description = typeof key === "undefined" ? value : translate(key, { number: value });

    return (
        <LeadGeneratorFilter>
            <RangeFixedValues
                fixedValues={filter.numberOptions}
                value={getClientValue()}
                onChange={setServerValue}
                title={i18nFilter()(filter.title)}
                description={description}
                inactive={false}
                allowCross={false}
                pushable={1}
                dataAutomation={`lead-generator-range-${_.kebabCase(filter.stateName)}`}
            />
        </LeadGeneratorFilter>
    );
};
