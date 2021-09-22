import dayjs, { Dayjs } from "dayjs";
import DurationService from "services/DurationService";
import { ICustomSegmentsGroup } from "services/segments/segmentsApiService";
import { Injector } from "common/ioc/Injector";

export const MAX_SEGMENTS_IN_GROUP = 25;

const segmentsGroupDurationOverrides = [
    {
        maxSegments: 10,
        allowedMonthRange: 24,
        allowedPresets: ["28d", "1m", "3m", "6m", "12m", "18m", "24m"],
        defaultPreset: "6m",
        fixed: false,
    },
    {
        maxSegments: 25,
        allowedMonthRange: 12,
        allowedPresets: ["28d", "1m", "3m", "6m", "12m"],
        defaultPreset: "6m",
        fixed: false,
    },
    {
        maxSegments: 50,
        allowedMonthRange: 6,
        allowedPresets: ["6m"],
        defaultPreset: "6m",
        fixed: true,
    },
    {
        maxSegments: 100,
        allowedMonthRange: 3,
        allowedPresets: ["3m"],
        defaultPreset: "3m",
        fixed: true,
    },
];
const WWSegmentsGroupDurationOverrides = [
    {
        maxSegments: 10,
        allowedMonthRange: 12,
        allowedPresets: ["28d", "1m", "3m", "6m", "12m"],
        defaultPreset: "6m",
        fixed: false,
    },
    {
        maxSegments: 25,
        allowedMonthRange: 6,
        allowedPresets: ["28d", "1m", "3m", "6m"],
        defaultPreset: "6m",
        fixed: false,
    },
    {
        maxSegments: 50,
        allowedMonthRange: 6,
        allowedPresets: ["6m"],
        defaultPreset: "6m",
        fixed: true,
    },
    {
        maxSegments: 100,
        allowedMonthRange: 3,
        allowedPresets: ["3m"],
        defaultPreset: "3m",
        fixed: true,
    },
];

export interface IDurationSetup {
    durationEnabled: boolean;
    allowedPresets: string[];
    defaultPreset: string;
    minDate?: Dayjs;
    maxDate?: Dayjs;
}

const getDurationOverrideForSegmentsGroup = (group: ICustomSegmentsGroup): any => {
    const swNavigator = Injector.get("swNavigator");
    const { country } = swNavigator.getParams();
    if (country === "999") {
        return WWSegmentsGroupDurationOverrides.find(
            (segConfig) => group?.segments.length <= segConfig.maxSegments,
        );
    }
    return segmentsGroupDurationOverrides.find(
        (segConfig) => group?.segments.length <= segConfig.maxSegments,
    );
};

export const getDurationSetupForSegmentsGroup = (
    group: ICustomSegmentsGroup,
    componentSettings: any,
): IDurationSetup => {
    const durationOverride = getDurationOverrideForSegmentsGroup(group);
    const { startDate, endDate } = componentSettings;
    const durationEnabled = !durationOverride.fixed;
    return {
        durationEnabled,
        allowedPresets: durationOverride.allowedPresets,
        defaultPreset: durationOverride.defaultPreset,
        ...(durationEnabled && {
            minDate: dayjs.max(
                dayjs(startDate),
                dayjs(endDate)
                    .startOf("month")
                    .subtract(durationOverride.allowedMonthRange - 1, "months"),
            ),
            maxDate: dayjs(endDate),
        }),
    };
};

export const getValidDurationBySetup = (
    durationSetup: IDurationSetup,
    duration: string,
): string => {
    const durationRaw = DurationService.getDurationData(duration).raw;
    let validDuration = duration;

    // if custom date range
    if (durationRaw.isCustom && durationSetup.minDate && durationSetup.maxDate) {
        // intersect date range with allowed date range
        const durationFrom = dayjs.max(durationRaw.from, durationSetup.minDate);
        const durationTo = dayjs.min(durationRaw.to, durationSetup.maxDate);
        // if intersection date range is valid, set to updated date range
        if (!durationFrom.isAfter(durationTo)) {
            validDuration = DurationService.getDiffCustomRangeParam(durationFrom, durationTo);
        }
        // otherwise choose the default preset
        else {
            validDuration = durationSetup.defaultPreset;
        }
    }
    // else, check date preset is allowed
    else {
        validDuration = durationSetup.allowedPresets.includes(duration)
            ? duration
            : durationSetup.defaultPreset;
    }

    return validDuration;
};
