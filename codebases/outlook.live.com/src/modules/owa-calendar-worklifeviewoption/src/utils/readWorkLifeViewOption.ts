import {
    getOptionsForFeature,
    CalendarSurfaceOptions,
    WorkLifeViewOptionFlags,
    OwsOptionsFeatureType,
    getDefaultOptions,
} from 'owa-outlook-service-options';

export function readWorkLifeViewOption(): number {
    let workLifeViewOption = 0;

    workLifeViewOption = getOptionsForFeature<CalendarSurfaceOptions>(
        OwsOptionsFeatureType.CalendarSurfaceOptions
    ).workLifeView;

    // if workLifeViewOption is zero, that means it has never been set before, in that case use the default value
    if (workLifeViewOption == 0) {
        let defaultOptions = getDefaultOptions()[
            OwsOptionsFeatureType.CalendarSurfaceOptions
        ] as CalendarSurfaceOptions;
        workLifeViewOption = defaultOptions.workLifeView;
    }

    return workLifeViewOption;
}

export function isWorkViewEnabled(): number {
    return readWorkLifeViewOption() & WorkLifeViewOptionFlags.Work;
}

export function isLifeViewEnabled(): number {
    return readWorkLifeViewOption() & WorkLifeViewOptionFlags.Life;
}
