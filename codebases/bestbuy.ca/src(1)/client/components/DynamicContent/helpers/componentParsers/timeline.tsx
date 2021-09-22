import * as React from "react";
import {TimelineProps} from "components/banners/Timeline";
import {IBrowser as ScreenSize} from "redux-responsive";
import FeatureBanner from "components/banners/FeatureBanner";
import {isObject, isDefined, guardType} from "utils/typeGuards";
import {featureBannerParser} from "./featureBanner";

interface BuildProps {
    screenSize: ScreenSize;
    language: Language;
}

// todo: data should be unknown type but after upgrading to ts 3
export const timelineParser = (data: {}, buildProps: BuildProps): TimelineProps | null => {
    if (!isObject(data)) {
        return null;
    }
    const stages = data && Array.isArray(data.stages) ? data.stages : [];
    const timelineStages = stages
        .map((stage: any) => {
            if (!Array.isArray(stage.items) || !stage.items[0]) {
                return;
            }
            const bannerProps = featureBannerParser(
                {
                    ...stage.items[0],
                    countdown: {
                        offsetTime: guardType(stage.offsetTime, "number"),
                        onsetTime: stage.onsetTime,
                        onsetText: stage.onsetText,
                        displayOptions: {...stage.displayOptions},
                    },
                },
                {screenSize: buildProps.screenSize},
            );

            return bannerProps
                ? {
                      item: <FeatureBanner {...bannerProps} />,
                      offsetTime: stage.offsetTime * 1000,
                      onsetTime: stage.onsetTime * 1000,
                  }
                : undefined;
        })
        .filter(isDefined);

    return {
        stages: timelineStages,
    };
};
