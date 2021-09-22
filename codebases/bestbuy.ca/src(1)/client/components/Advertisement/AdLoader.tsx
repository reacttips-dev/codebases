import {useEffect} from "react";
import googlePublisherTag, {AdTargetingProps, GoogleAdsEventAdSlot} from "./GooglePublisherTag";
import {AdItem} from ".";
import getLogger from "common/logging/getLogger";
import State from "store";
import {connect} from "react-redux";

export interface AdLoaderProps {
    items: AdItem[];
    adTargetingProps: AdTargetingProps;
    callbackOnAdRendered: (adSlotId: string, adRendered: boolean, adSlot: GoogleAdsEventAdSlot) => void;
    isReady?: boolean;
}
export interface StateProps {
    adBlockerIsActive: boolean;
}

export const AdLoader: React.FC<AdLoaderProps & StateProps> = ({
    isReady = true,
    items,
    adTargetingProps,
    adBlockerIsActive,
    callbackOnAdRendered,
}) => {
    if (adBlockerIsActive || !items || items.length === 0 || !isReady) {
        return null;
    }
    const environment = adTargetingProps.environment || "localhost";
    const newAdTargetingProps = {
        ...adTargetingProps,
        environment,
    };

    useEffect(() => {
        try {
            googlePublisherTag
                .constructAdSlots(items)
                .loadAds(newAdTargetingProps)
                .addEventListener(callbackOnAdRendered)
                .refreshAds();
        } catch (error) {
            getLogger().error(`Error constructing and loading google Ads.\nError: ${error}`);
        }
    }, [isReady]);

    return null;
};

AdLoader.displayName = "AdLoader";

const mapStateToProps = (state: State): StateProps => ({
    adBlockerIsActive: state.app.adBlockerIsActive,
});

export default connect<StateProps, {}, AdLoaderProps, State>(mapStateToProps)(AdLoader);
