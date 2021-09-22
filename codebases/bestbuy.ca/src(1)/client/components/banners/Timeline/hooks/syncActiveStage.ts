import * as React from "react";
import {TimelineStage} from "..";

const getActiveStageIndex = (stages: TimelineStage[]): number => {
    const globalOffset = (typeof window !== "undefined" && window.globalDateOffset) || 0;
    const now = new Date().getTime() - globalOffset;
    return stages.findIndex((stage) => now >= stage.onsetTime && (now <= stage.offsetTime || !stage.offsetTime));
};

const syncActiveStage = (stages: TimelineStage[], checkInt: number): [number, () => void] => {
    const [currentStageIndex, setCurrentStage] = React.useState(getActiveStageIndex(stages));
    const prevStageIndexRef = React.useRef(currentStageIndex);
    const isClientSide = typeof window !== "undefined";
    let interval: number;

    const cancelSync = () => {
        if (isClientSide) {
            window.clearInterval(interval);
        }
    };

    const setSyncInterval = (int: number) => {
        if (isClientSide) {
            interval = window.setInterval(() => {
                const newStageIndex = getActiveStageIndex(stages);
                if (newStageIndex !== prevStageIndexRef.current) {
                    setCurrentStage(newStageIndex);
                    prevStageIndexRef.current = newStageIndex;
                }
            }, int);
        }
    };

    React.useEffect(() => {
        setSyncInterval(checkInt);
        return cancelSync;
    }, []);

    return [currentStageIndex, cancelSync];
};

export default syncActiveStage;
