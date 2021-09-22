import * as React from "react";
import {classname} from "utils/classname";
import * as styles from "./styles.css";
import syncActiveStage from "./hooks/syncActiveStage";

export interface TimelineStage {
    onsetTime: number;
    offsetTime: number;
    item: React.Component | JSX.Element;
}
export interface TimelineProps {
    id?: string;
    className?: string;
    stages: TimelineStage[];
}

enum Intervals {
    stageSync = 1000,
    animation = 2000,
}

/**
 * The business logic for the timeline is as follows:
 *
 * If on initial render there are no active stages:
 *    - don't render a timeline at all
 *    - don't check for new stages
 *
 * If on initial render is an active stage:
 *    - render the initial stage
 *    - continue to check for a new stage and render if necassary
 */

const Timeline: React.FC<TimelineProps> = ({className, id, stages}) => {
    const initialRender = React.useRef(true);
    const [activeStageIndex, cancelStageSync] = syncActiveStage(stages, Intervals.stageSync);
    const [nextBannerIndex, setNextBannerIndex] = React.useState(-1);
    const [prevBannerIndex, setPrevBannerIndex] = React.useState(-1);
    const [visibleBannerIndex, setVisibleBannerIndex] = React.useState(activeStageIndex);
    const prevStageIndexRef = React.useRef(activeStageIndex);
    const [blockRender] = React.useState(activeStageIndex === -1 || !stages[activeStageIndex].item);

    let animationInt = 0;

    const clearTimeout = () => {
        window.clearTimeout(animationInt);
    };

    React.useEffect(() => {
        if (blockRender) {
            cancelStageSync();
        }
    }, []);

    React.useEffect(() => {
        if (activeStageIndex > -1 && stages[activeStageIndex].item && !initialRender.current) {
            clearTimeout();
            setPrevBannerIndex(prevStageIndexRef.current);
            setNextBannerIndex(activeStageIndex);
            prevStageIndexRef.current = activeStageIndex;

            animationInt = window.setTimeout(() => {
                setVisibleBannerIndex(activeStageIndex);
                setNextBannerIndex(-1);
                setPrevBannerIndex(-1);
            }, Intervals.animation);
        }

        initialRender.current = false;

        return clearTimeout;
    }, [activeStageIndex]);

    return (
        <>
            {!blockRender && (
                <div id={id} className={classname([styles.timeline, className])}>
                    {stages.map((stage, index) => {
                        return (
                            <div
                                key={"stage" + index}
                                className={classname([
                                    styles.stage,
                                    index === visibleBannerIndex && styles.active,
                                    index === nextBannerIndex && styles.enter,
                                    index === prevBannerIndex && styles.leave,
                                ])}>
                                {(index === visibleBannerIndex || index === nextBannerIndex) && stage.item}
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
};

export default Timeline;
