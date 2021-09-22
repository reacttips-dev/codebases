import * as React from "react";
import {injectIntl, InjectedIntlProps} from "react-intl";
import messages from "./translations/messages";
import {IBrowser} from "redux-responsive/types";
import * as styles from "./style.css";
import RecommendedSkuList from "components/recommendations/components/RecommendedSkuList";
import {convertLocaleToLang} from "../../../models";
import {connect} from "react-redux";
import State from "store";
import {recommendationDataMapper} from "Decide/providers/ProductProvider/recommendationDataMapper";
import {getScreenSize} from "store/selectors";

interface StateProps {
    products: any[];
    screenSize: IBrowser;
    regionCode: string;
}
interface RecommendationsProps {
    noCrawl?: boolean;
    titleAlign?: "left" | "center";
    className?: string;
    extraAttributes?: any;
}

export const TopSellers: React.SFC<RecommendationsProps & StateProps & InjectedIntlProps> = (props) => {
    // Do not display recommendations to users in NB due to the difference between QC and NB environment handling fees, to be revisited later.
    if (!props.products || props.products.length === 0 || props.regionCode === "NB") {
        return null;
    }

    const title = props.intl.formatMessage(messages.topSeller);
    const titleAlignment = props.titleAlign === "center" ? styles.titleCenter : "";
    const classes = `${titleAlignment} ${props.className}`;
    return (
        <RecommendedSkuList
            products={props.products}
            screenSize={props.screenSize}
            language={convertLocaleToLang(props.intl.locale as Locale)}
            title={title}
            className={`x-top-sellers ${classes}`}
            noCrawl={props.noCrawl}
            extraAttributes={{...props.extraAttributes}}
        />
    );
};

const mapStateToProps = (state: State): StateProps => {
    let products = state.search.recommendations.topSellers;
    if (products.length) {
        products = (products as any[])
            .map((rawProductData) =>
                recommendationDataMapper(rawProductData, state.intl.locale, state.app.location.regionCode),
            )
            .map((product) => ({
                ...product,
                query: {
                    icmp: "Recos_3across_tp_sllng_prdcts",
                    referrer: "PLP_Reco",
                },
            }));
    }

    return {
        products,
        screenSize: getScreenSize(state),
        regionCode: state.app.location.regionCode,
    };
};

TopSellers.displayName = "TopSellers";

export default connect<StateProps, {}, RecommendationsProps, State>(mapStateToProps)(injectIntl(TopSellers));
