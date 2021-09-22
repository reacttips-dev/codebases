import * as React from "react";
import {AdSlot, AvailableAdFormats, AdName} from "../Advertisement";
import * as styles from "./style.css";
import {classIf} from "utils/classname";

export interface ABTestAdSlotProps {
    adSlotContainerId: string;
    adName: string;
}

const ABTestAdSlot: React.FC<ABTestAdSlotProps> = ({adSlotContainerId, adName}) => {
    const [adSlotVisible, setAdSlotVisibility] = React.useState(false);
    const updateStaticAdVisibility = (showAd: boolean) => {
        const serverSideRender = !adSlotVisible && !showAd; // server-side load
        const clientSideRender = !adSlotVisible && showAd; // client-side load

        if (serverSideRender || clientSideRender) {
            setAdSlotVisibility(true);
        }
    };

    return (
        <div
            className={`${classIf(styles.superLeaderboard, adName === AdName.superLeaderboard)}
            ${classIf(styles.pencilAd, adName === AdName.pencilAd)}
            ${classIf(styles.hide, !adSlotVisible)}`}>
            <AdSlot
                adSlotWrapperClasses={styles.hardCodedAdSlot}
                containerId={adSlotContainerId}
                onAdAvailabilityChange={updateStaticAdVisibility}
                format={AvailableAdFormats.leaderboard}
                automationName={adName}
            />
        </div>
    );
};

export default ABTestAdSlot;
