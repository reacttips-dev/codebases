import { createDayjs, IComparedDuration } from "@similarweb/ui-components/dist/duration-selector";
import { IDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import _ from "lodash";

export const convertInitialPresetToDuration = (initialPreset, presets) => {
    if (initialPreset.indexOf("-") > 1) {
        const [from, to] = initialPreset.split("-");
        const [fromYear, fromMonth, fromDay] = from.split(".");
        const [toYear, toMonth, toDay] = to.split(".");
        if (fromDay && toDay) {
            return {
                from: createDayjs(fromYear, fromMonth - 1, fromDay),
                to: createDayjs(toYear, toMonth - 1, toDay),
                isDaily: true,
            };
        }
        return {
            from: createDayjs(fromYear, fromMonth - 1),
            to: createDayjs(toYear, toMonth - 1),
        };
    } else {
        return getPresetById(presets, initialPreset).value;
    }
};

export const getSelectedDurationPresetId = (
    compareDurationSelected: IComparedDuration,
    presets,
    granularity = "month",
) => {
    const selectedPreset: IDropdownItem[] = presets.filter(
        (preset: IDropdownItem<any>) =>
            compareDurationSelected.primary.from.isSame(preset.value.from) &&
            compareDurationSelected.primary.to.month() === preset.value.to.month() &&
            compareDurationSelected.primary.to.year() === preset.value.to.year() &&
            (granularity === "day"
                ? compareDurationSelected.primary.to.dayOfYear() === preset.value.to.dayOfYear()
                : true),
    );

    return selectedPreset && selectedPreset[0] ? selectedPreset[0].id : null;
};

export const convertInitialPresetToCustom = (initialPreset) => {
    if (!initialPreset.includes("-")) {
        return;
    }
    const [from, to] = initialPreset.split("-");
    const [fromYear, fromMonth, fromDay] = from.split(".");
    const [toYear, toMonth, toDay] = to.split(".");
    const duration = {
        from: createDayjs(fromYear, fromMonth - 1, fromDay),
        to: createDayjs(toYear, toMonth - 1, toDay),
    };
    const format = fromDay && toDay ? "MMM Do, YY" : "MMM, YYYY";
    return `${duration.from.format(format)} - ${duration.to.format(format)} (Custom)`;
};

export const getCompareDurationSelected = (duration, isCompare, compareType) => {
    let secondaryDuration = null;
    if (isCompare) {
        switch (compareType) {
            case "previous period":
                const durationSize = duration.to.diff(duration.from, "month");
                secondaryDuration = {
                    from: duration.from.clone().subtract(durationSize + 1, "month"),
                    to: duration.from.clone().subtract(1, "month"),
                };
                break;
            case "previous year":
                secondaryDuration = {
                    from: duration.from.clone().subtract(1, "year"),
                    to: duration.to.clone().subtract(1, "year"),
                };
                break;
            default:
                secondaryDuration = null;
                break;
        }
    }
    return { primary: duration, secondary: secondaryDuration };
};

export const getDropDownButtonTitle = (initialPreset, presets) => {
    const selected: any = _.find(presets, { id: initialPreset });
    if (selected) {
        return selected.displayText;
    } else {
        return convertInitialPresetToCustom(initialPreset);
    }
};

export const getDurationText = (duration: IComparedDuration) => {
    const compareDurationSelected = duration.primary;
    return `${compareDurationSelected.from.format(
        "MMM YYYY",
    )} - ${compareDurationSelected.to.format("MMM YYYY")}`;
};

export const isCompareDuration = (compareSelected, compareEnabled, compareAllowed) => {
    return compareSelected && compareEnabled && compareAllowed;
};

const getPresetById = (presets, id) => {
    const matchPreset = presets.find((preset: any) => preset.id === id);
    return matchPreset || presets.find((preset: any) => preset.id === "3m");
};
