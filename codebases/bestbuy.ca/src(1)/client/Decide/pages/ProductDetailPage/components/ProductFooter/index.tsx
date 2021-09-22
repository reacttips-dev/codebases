import * as React from "react";
import {IBrowser as ScreenSize} from "redux-responsive/types";
import {connect} from "react-redux";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {Recommendations, Region} from "models";
import {State} from "store";
import {RecommendedSkuList} from "components/recommendations/components/RecommendedSkuList";
import {RecentlyViewed} from "components/recommendations/RecentlyViewed";
import CriteoSponsoredProducts from "components/CriteoSponsoredProducts";
import {recommendationDataMapper} from "../../../../providers/ProductProvider/recommendationDataMapper";
import messages from "./translations/messages";
import * as styles from "./style.css";
import {getScreenSize} from "store/selectors";

export interface StateProps {
    locale: Locale;
    screenSize: ScreenSize;
    regionCode: Region;
    regionName: string;
    recommendations: Recommendations;
}

export interface ProductFooterProps extends StateProps, InjectedIntlProps {
    disableSeoAttributes?: boolean;
}

export class ProductFooter extends React.Component<ProductFooterProps> {
    public render() {
        return (
            <>
                <div className={styles.productFooter}>
                    {this.getCustomerAlsoViewed()}
                    {this.getPDPSponsoredProductsCarousel()}
                    {this.getRecentlyViewed()}
                </div>
                {this.props.children}
            </>
        );
    }

    private getCustomerAlsoViewed = () => {
        const recommendations = (this.props as any).recommendations;
        const data = recommendations && recommendations.customerAlsoViewed;
        const {regionCode, regionName, disableSeoAttributes} = this.props;

        if (!data || !data.length || this.props.regionCode === "NB") {
            return null;
        }

        const products = data
            .map((rawProductData) => recommendationDataMapper(rawProductData, this.props.locale, regionCode))
            .map((product) => ({
                ...product,
                query: {
                    icmp: "Recos_4across_cstmrs_ls_vwd",
                    referrer: "PDP_Reco",
                },
            }));

        const title = this.props.intl.formatMessage(messages.customersAlsoViewed);

        return (
            <React.Fragment>
                <hr className={styles.divider} />
                <RecommendedSkuList
                    products={products}
                    screenSize={this.props.screenSize}
                    regionName={regionName}
                    language={this.props.intl.locale as Language}
                    title={title}
                    className="x-customers-also-viewed"
                    noCrawl={true}
                    disableSeoAttributes={disableSeoAttributes}
                />
            </React.Fragment>
        );
    };

    private getPDPSponsoredProductsCarousel = () => {
        const title = this.props.intl.formatMessage(messages.sponsoredProducts);

        return (
            <div className={styles.sponsoredProducts}>
                <CriteoSponsoredProducts alignLeft={true} disableSeoAttributes={this.props.disableSeoAttributes}>
                    <hr className={styles.divider} />
                    <h2 className={styles.header}>{title}</h2>
                </CriteoSponsoredProducts>
            </div>
        );
    };

    private getRecentlyViewed = () => {
        const {intl, disableSeoAttributes} = this.props;

        const query = {
            icmp: "Recos_5across_yr_rcntly_vwd_tms",
            referrer: "PDP_Reco",
        };
        const title = intl.formatMessage(messages.recentlyViewed);

        return (
            <>
                <hr className={styles.divider} />
                <RecentlyViewed
                    title={title}
                    noCrawl={true}
                    disableSeoAttributes={disableSeoAttributes}
                    query={{...query}}
                />
            </>
        );
    };
}

const mapStateToProps = (state: State) => {
    return {
        recommendations: state.product.recommendations,
        locale: state.intl.locale,
        regionCode: state.app.location.regionCode,
        regionName: state.intl.messages["regionNames." + state.app.location.regionCode],
        screenSize: getScreenSize(state)
    };
};

export default connect<StateProps>(mapStateToProps)(injectIntl(ProductFooter));
