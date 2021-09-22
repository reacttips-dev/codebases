import * as React from "react";
import {CellPhonePlanStore} from "models/CellPhonePlan";
import CellPhonePlanPrice from "../../../../components/CellPhonePlanPrice";
import {CellPhonePlanPricePlaceHolder} from "../../../../components/CellPhonePlanPrice/CellPhonePlanPricePlaceHolder";

export interface MobileActivationPlanOfferOwnProps {
    cellPhonePlan: CellPhonePlanStore;
}

export type MobileActivationPlanOfferProps = MobileActivationPlanOfferOwnProps;

export const MobileActivationPlanOffer: React.FC<MobileActivationPlanOfferProps> = ({cellPhonePlan}) => {

    const shouldRenderPhonePlan = React.useMemo(() => !!cellPhonePlan && !cellPhonePlan.loading, [cellPhonePlan]);
    return shouldRenderPhonePlan ? (
        <div data-automation="cellphone-carrier-variant">
            <CellPhonePlanPrice plan={cellPhonePlan}/>
        </div>
    ) : (
        <CellPhonePlanPricePlaceHolder/>
    );
};

export default MobileActivationPlanOffer;
