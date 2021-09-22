import * as React from "react";
import State from "store";
import {connect} from "react-redux";
import * as styles from "./styles.css";
import {GoogleAd, GoogleAds} from "reducers";
import {InjectedIntlProps, injectIntl} from "react-intl";
import messages from "./translations/messages";
import {classIf} from "utils/classname";

interface StateProps {
    isAdBlockerActive: boolean;
    googleAds: GoogleAds;
}
interface AdSlotProps {
    containerId: string;
    adSlotWrapperClasses?: string;
    onAdAvailabilityChange?: (isAdAvaliable: boolean) => void;
    format: string;
    automationName?: string;
}

export const AdSlot: React.FC<AdSlotProps & StateProps & InjectedIntlProps> = ({
    containerId,
    adSlotWrapperClasses = "",
    isAdBlockerActive,
    googleAds,
    onAdAvailabilityChange,
    format,
    intl,
    automationName,
}) => {
    if (!containerId || (!onAdAvailabilityChange && isAdBlockerActive)) {
        return null;
    }
    const adState: GoogleAd = googleAds[containerId] || {};
    if (onAdAvailabilityChange) {
        if (isAdBlockerActive) {
            onAdAvailabilityChange(false);
        } else if (typeof adState.adRendered !== "undefined") {
            onAdAvailabilityChange(adState.adRendered);
        } else if (typeof adState.adRendered === "undefined") {
            onAdAvailabilityChange(false);
        }
    }
    const adFormatClass = styles[format];
    const wrapperClasses = classIf([adSlotWrapperClasses, adFormatClass], !!adFormatClass, adSlotWrapperClasses).trim();
    const nativeAdContainerStyle = classIf(
        [styles.nativeAdSlotContainerStyles, styles.adSlotContainerStyles],
        adState.isNativeAd,
        styles.adSlotContainerStyles,
    );
    return (
        <section data-automation="dynamic-content-ad-slot" className={wrapperClasses}>
            <div className={nativeAdContainerStyle}>
                {adState.isSponsored && (
                    <div className={styles.sponsoredLabel}>{intl.formatMessage(messages.sponsoredLabel)}</div>
                )}
                <div className={styles.adContainer} id={containerId} data-automation={automationName} />
            </div>
        </section>
    );
};

AdSlot.displayName = "AdSlot";

const mapStateToProps = (state: State): StateProps => ({
    isAdBlockerActive: state.app.adBlockerIsActive,
    googleAds: state.ads.googleAds,
});

export default connect<StateProps, {}, AdSlotProps, State>(mapStateToProps)(injectIntl(AdSlot));
