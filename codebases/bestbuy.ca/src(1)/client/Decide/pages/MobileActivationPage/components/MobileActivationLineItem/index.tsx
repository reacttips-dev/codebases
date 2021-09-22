import * as React from "react";
import {Col, Row} from "@bbyca/bbyca-components";

import {DetailedProduct} from "models/DetailedProduct";

import * as styles from "./styles.css";
import MobileActivationPlanOffer from "Decide/pages/MobileActivationPage/components/MobileActivationPlanOffer/MobileActivationPlanOffer";
import State from "store";
import {getCellPhonePlan, getProductData} from "Decide/store/selectors";
import {connect} from "react-redux";
import {CellPhonePlanStore} from "models";

export interface MobileActivationItemStateProps {
    product: DetailedProduct;
    cellPhonePlan: CellPhonePlanStore;
}
export type MobileActivationItemProps = MobileActivationItemStateProps;

export const MobileActivationLineItem: React.FC<MobileActivationItemProps> = ({product, cellPhonePlan}) =>
    <div className={styles.mobileActivationLineItem}>
        <div className={styles.container}>
            <Row>
                <Col xs={12} md={2} className={styles.productImageColumn}>
                    <img className={styles.productImage} src={product?.productImage} alt={""}/>
                </Col>
                <Col xs={12} md={6} className={styles.productNameColumn}>
                    <p>
                        {product?.name}
                    </p>
                </Col>
                <Col xs={12} md={4} className={styles.productPriceColumn}>
                    <MobileActivationPlanOffer cellPhonePlan={cellPhonePlan}/>
                </Col>
            </Row>
        </div>
    </div>;

const mapStateToProps = (state: State): MobileActivationItemStateProps => {
    return {
        product: getProductData(state),
        cellPhonePlan: getCellPhonePlan(state),
    };
};

export default connect(mapStateToProps)(MobileActivationLineItem);
