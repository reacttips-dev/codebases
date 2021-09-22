import {Col, Row} from "@bbyca/ecomm-components";
import * as React from "react";
import * as styles from "./style.css";

export const ProductListPlaceholder = () => {
    const productItems = [];

    for (let index = 0; index < 8; index++) {
        productItems.push(
            <Col key={index} xs={12} sm={4} lg={3} xl={2}>
                <Row>
                    <Col xs={4} sm={12}>
                        <div className={styles.imagePlaceholder}></div>
                    </Col>
                    <Col xs={8} sm={12}>
                        <div className={styles.svgContainer}>
                            <div className={styles.namePlaceholderTop} />
                            <div className={styles.namePlaceholderBottom} />
                            <div className={styles.ratingPlaceholder} />
                            <div className={styles.pricePlaceholder} />
                            <div className={styles.onlineAvailabilityPlaceholder} />
                            <div className={styles.storeAvailabilityPlaceholder} />
                        </div>
                    </Col>
                </Row>
            </Col>,
        );
    }

    return <Row className={styles.mainRow}>{productItems}</Row>;
};

export default ProductListPlaceholder;
