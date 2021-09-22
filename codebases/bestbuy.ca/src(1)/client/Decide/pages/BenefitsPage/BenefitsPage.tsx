import * as React from "react";
import { injectIntl, InjectedIntlProps } from "react-intl";
import {BenefitPage as Benefits} from "@bbyca/ecomm-checkout-components/dist/components";
import { ChevronLeft } from "@bbyca/bbyca-components";

import Header from "components/Header";
import HeadTags from "components/HeadTags";
import PageContent from "components/PageContent";
import Link from "components/Link";
import Footer from "components/Footer";

import messages from "./translations/messages";
import * as style from "./style.css";
import { RouteParams } from "../CreateProductReviewPage/CreateProductReviewPage";

const metaTags = [{ name: "robots", content: "noindex" }];

export interface OwnProps {
    params: RouteParams;
}

export type Props = OwnProps & InjectedIntlProps;

export class BenefitsPage extends React.Component<Props> {

    public render() {
        const sku = this.getSku();
        const {intl: { formatMessage }} = this.props;

        return (
            <>
                <HeadTags
                    title={formatMessage(messages.title)}
                    metaTags={metaTags} />
                <Header />
                <div className={style.benefitsPageContainer}>
                    <PageContent>
                        <div className={style.backBtnContainer}>
                            <Link to="basket">
                                <div className={style.backButton} data-automation="back-to-cart">
                                    <div className={style.leftChevron}>
                                        <ChevronLeft color="blue"/>
                                    </div>
                                    {formatMessage(messages.backBtn)}
                                </div>
                            </Link>
                        </div>
                        <hr/>
                        <Benefits sku={sku}/>
                    </PageContent>
                </div>
                <Footer/>
            </>
        );
    }

    private getSku = () => {
        return this.props.params.sku;
    }
}

export default injectIntl(BenefitsPage);
