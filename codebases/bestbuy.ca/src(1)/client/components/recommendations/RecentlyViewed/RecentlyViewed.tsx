import * as React from "react";
import State from "store";
import {connect} from "react-redux";
import {IBrowser} from "redux-responsive/types";
import {classIf, classname} from "utils/classname";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {convertLocaleToLang, RecommendationApiProduct, Region, RegionCode} from "../../../models";
import {recommendationDataMapper} from "Decide/providers/ProductProvider/recommendationDataMapper";
import RecommendedSkuList from "components/recommendations/components/RecommendedSkuList";
import messages from "./translations/messages";
import * as styles from "./style.css";
import {getScreenSize} from "store/selectors";

interface StateProps {
    products?: RecommendationApiProduct[];
    screenSize: IBrowser;
    regionCode: Region;
}
interface RecommendationsProps {
    noCrawl?: boolean;
    titleAlign?: "left" | "center";
    title?: string;
    className?: string;
    disableSeoAttributes?: boolean;
    extraAttributes?: any;
    query?: {
        icmp: string;
        referrer: string;
    };
}

export const RecentlyViewed: React.FC<RecommendationsProps & StateProps & InjectedIntlProps> = (props) => {
    const {
        products,
        regionCode,
        intl,
        titleAlign,
        className,
        query,
        title,
        disableSeoAttributes,
        noCrawl,
        extraAttributes,
        screenSize,
    } = props;
    // Do not display recommendations to users in NB due to the difference between QC and NB environment handling fees, to be revisited later.
    if (!products || products.length === 0 || regionCode === RegionCode.NB) {
        return null;
    }

    const productData = products.map((rawProductData: RecommendationApiProduct) => {
        rawProductData.query = query;
        return recommendationDataMapper(rawProductData, intl.locale as Locale, props.regionCode);
    });

    const recommendationTitle = title || intl.formatMessage(messages.recentlyViewed);
    const classes = classname([classIf(styles.titleCenter, titleAlign === "center"), className, "x-recently-viewed"]);

    return (
        <RecommendedSkuList
            products={productData}
            screenSize={screenSize}
            language={convertLocaleToLang(intl.locale as Locale)}
            title={recommendationTitle}
            className={classes}
            noCrawl={noCrawl}
            disableSeoAttributes={disableSeoAttributes}
            extraAttributes={{...extraAttributes}}
        />
    );
};

const mapStateToProps = (state: State): StateProps => {
    return {
        products: state.recommendations.recentlyViewed,
        screenSize: getScreenSize(state),
        regionCode: state.app.location.regionCode,
    };
};

RecentlyViewed.displayName = "RecentlyViewed";

export default connect<StateProps>(mapStateToProps)(injectIntl(RecentlyViewed));
