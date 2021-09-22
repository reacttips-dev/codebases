import * as React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";

import State from "store";
import {CellPhonePlanStore} from "models/CellPhonePlan";

import {ProductActionCreators, productActionCreators} from "../../../../actions";
import {getCellPhonePlan, getProductSku} from "../../../../store/selectors";
import CellPhonePlanPrice from "../../../../components/CellPhonePlanPrice";
import ActivationGiftCard from "../../components/ActivationGiftCard/ActivationGiftCard";
import {CellPhonePlanPricePlaceHolder} from "../../../../components/CellPhonePlanPrice/CellPhonePlanPricePlaceHolder";

export interface Props {
    cellPhonePlan: CellPhonePlanStore;
    sku: string;
}

export interface CellPhonePlanOfferDispatchProps {
    productActions: ProductActionCreators;
}

export type CellPhonePlanOfferProps = CellPhonePlanOfferDispatchProps & Props;

export const CellPhonePlanOffer: React.FC<CellPhonePlanOfferProps> = ({cellPhonePlan, sku, productActions}) => {
    React.useEffect(() => {
        productActions.fetchCellPhonePlan(sku);
    }, [sku]);

    const shouldRenderPhonePlan = React.useMemo(() => !!cellPhonePlan && !cellPhonePlan.loading, [cellPhonePlan]);
    const giftCardAmount = React.useMemo(() => {
        return cellPhonePlan && cellPhonePlan.giftCard ? parseFloat(cellPhonePlan.giftCard) : 0;
    }, [cellPhonePlan]);

    return !shouldRenderPhonePlan ? (
        <CellPhonePlanPricePlaceHolder />
    ) : (
        <div data-automation="cellphone-carrier-variant">
            <CellPhonePlanPrice plan={cellPhonePlan} />
            {giftCardAmount > 0 ? <ActivationGiftCard giftCardAmount={giftCardAmount} /> : null}
        </div>
    );
};

const mapStateToProps = (state: State) => {
    return {
        cellPhonePlan: getCellPhonePlan(state),
        sku: getProductSku(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        productActions: bindActionCreators(productActionCreators, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CellPhonePlanOffer);
