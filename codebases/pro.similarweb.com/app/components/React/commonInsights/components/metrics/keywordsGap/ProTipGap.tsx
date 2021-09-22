import { ProTip } from "components/React/commonInsights/components/ProTip";
import { EDestination, mapStateToProps } from "components/React/commonInsights/utilities/functions";
import { connect } from "react-redux";

export const ProTipGapInner = ({
    chosenItems,
    onCtaClickEventName,
    mainTextKey,
    innerLinkKey = "website.performance.insights.pro.tip.win.lose.cta",
    innerLinkPage = "findkeywords_KeywordGap_home",
}) => {
    const { name: chosenSiteName, icon: chosenSiteFavicon } = chosenItems[0];
    return (
        <ProTip
            mainTextKey={mainTextKey}
            innerLinkPage={innerLinkPage}
            innerLinkKey={innerLinkKey}
            navigationParams={{
                chosenSiteName: chosenSiteName,
                chosenSiteFavicon: encodeURIComponent(chosenSiteFavicon),
            }}
            onCtaClickEventName={onCtaClickEventName}
            ctaDestination={EDestination.Gap}
        />
    );
};

export const ProTipGap = connect(mapStateToProps)(ProTipGapInner);
