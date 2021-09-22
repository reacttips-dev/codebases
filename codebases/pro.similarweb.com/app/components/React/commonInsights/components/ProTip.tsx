import { Insight } from "components/React/commonInsights/components/Insight";
import { MainText } from "components/React/commonInsights/components/MainText";
import {
    bold,
    getOnCtaClick,
    mapStateToProps,
} from "components/React/commonInsights/utilities/functions";
import { connect } from "react-redux";
import { i18nFilter } from "filters/ngFilters";

const DEFAULT_REPLACEMENT_OBJECT = {
    prefix: bold(i18nFilter()("website.performance.insights.prod.tip.prefix")),
};

export const ProTipInner = ({
    innerLinkKey,
    innerLinkPage,
    mainTextKey,
    params,
    onCtaClickEventName,
    ctaDestination,
    navigationParams = {},
    replacementObject = DEFAULT_REPLACEMENT_OBJECT,
}) => {
    return (
        <Insight
            innerLinkKey={innerLinkKey}
            mainText={<MainText mainTextKey={mainTextKey} replacementObject={replacementObject} />}
            onCtaClick={getOnCtaClick(onCtaClickEventName, ctaDestination)}
            innerLinkPage={innerLinkPage}
            navigationParams={{ ...params, ...navigationParams }}
        />
    );
};

export const ProTip = connect(mapStateToProps)(ProTipInner);
