import { Range } from "@similarweb/ui-components/dist/slider";
import { i18nFilter } from "filters/ngFilters";
import * as React from "react";
import { StatelessComponent } from "react";
import LeadGeneratorUtils from "../../../LeadGeneratorUtils";
import { LeadGeneratorFilter } from "../elements";
import { DefaultSummary } from "../summary/DefaultSummary";
import { IRangePercentFilterProps } from "./types";
import * as _ from "lodash";

export function getRangePercentSubtitle(serverValue, title) {
    function prettifyValue(val) {
        return `${Math.floor(parseFloat(val) * 100)}%`;
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

export function duplicate100(val) {
    return Math.floor(parseFloat(val) * 100);
}

export function division100(val) {
    return parseInt(val, 10) / 100;
}

function formatInitValue(initValue) {
    return initValue.split("...").map((val) => duplicate100(val));
}

function formatCrrValue(crrValue, initValue) {
    if (crrValue.includes(">=")) {
        return [duplicate100(crrValue.replace(">=", "")), initValue[1]];
    } else if (crrValue.includes("<=")) {
        return [initValue[0], duplicate100(crrValue.replace("<=", ""))];
    }
    return crrValue.split("...").map((val) => duplicate100(val));
}

export function getRangePercentDescription(filter) {
    const initValue = formatInitValue(filter.initValue);
    const crrValue = formatCrrValue(filter.getValue(), initValue);
    if (LeadGeneratorUtils.isOnlyFirstChanged(crrValue, initValue)) {
        return i18nFilter()("grow.lead_generator.new.range_filter.more_than", {
            number: `${crrValue[0]}%`,
        });
    } else if (LeadGeneratorUtils.isOnlySecondChanged(crrValue, initValue)) {
        return i18nFilter()("grow.lead_generator.new.range_filter.less_than", {
            number: `${crrValue[1]}%`,
        });
    }
    return crrValue.map((val) => `${val}%`).join(" - ");
}

export function getOppositePercentDescription(filter) {
    const initValue = formatInitValue(filter.initValue);
    const crrValue = formatCrrValue(filter.getValue(), initValue);
    if (LeadGeneratorUtils.isOnlyFirstChanged(crrValue, initValue)) {
        return i18nFilter()("grow.lead_generator.new.range_filter.less_than", {
            number: `${initValue[1] - crrValue[0]}%`,
        });
    } else if (LeadGeneratorUtils.isOnlySecondChanged(crrValue, initValue)) {
        return i18nFilter()("grow.lead_generator.new.range_filter.more_than", {
            number: `${initValue[1] - crrValue[1]}%`,
        });
    }
    return crrValue.map((val) => `${initValue[1] - val}%`).join(" - ");
}

export const RangePercentSummaryFilter: StatelessComponent<IRangePercentFilterProps> = ({
    filter,
}) => {
    let description = getRangePercentDescription(filter);
    if (filter.suffix) {
        description += ` ${i18nFilter()(filter.suffix)}`;
    }
    return <DefaultSummary title={filter.title} description={description} />;
};

export const RangePercentBoxFilter: StatelessComponent<IRangePercentFilterProps> = ({
    filter,
    setBoxActive,
    isDesktopOnly,
}) => {
    const setServerValue = (crrValue) => {
        let serverValue;
        const initValue = formatInitValue(filter.initValue);
        if (LeadGeneratorUtils.isOnlyFirstChanged(crrValue, initValue)) {
            serverValue = `>=${division100(crrValue[0])}`;
        } else if (LeadGeneratorUtils.isOnlySecondChanged(crrValue, initValue)) {
            serverValue = `<=${division100(crrValue[1])}`;
        } else {
            serverValue = crrValue.map((val) => division100(val)).join("...");
        }
        filter.setValue({
            [filter.stateName]: serverValue,
        });
        setBoxActive(true);
    };

    const getClientValue = () => {
        const initValue = formatInitValue(filter.initValue);
        const crrValue = filter.getValue();
        if (crrValue.includes(">=")) {
            return [duplicate100(crrValue.replace(">=", "")), duplicate100(initValue[1])];
        } else if (crrValue.includes("<=")) {
            return [duplicate100(initValue[0]), duplicate100(crrValue.replace("<=", ""))];
        }
        return crrValue.split("...").map((val) => duplicate100(val));
    };

    const initValue = formatInitValue(filter.initValue);
    const disabled = filter.shouldDisable && isDesktopOnly;
    return (
        <LeadGeneratorFilter>
            <Range
                min={initValue[0]}
                max={initValue[1]}
                value={getClientValue()}
                onChange={setServerValue}
                title={i18nFilter()(filter.title)}
                description={
                    disabled
                        ? i18nFilter()("grow.lead_generator.new.range_filter.disabled")
                        : getRangePercentDescription(filter)
                }
                inactive={false}
                allowCross={false}
                pushable={1}
                disabled={disabled}
                dataAutomation={`lead-generator-range-${_.kebabCase(filter.stateName)}`}
            />
        </LeadGeneratorFilter>
    );
};
