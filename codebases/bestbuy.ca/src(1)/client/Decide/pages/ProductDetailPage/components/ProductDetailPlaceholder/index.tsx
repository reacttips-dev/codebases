import {Col, Row} from "@bbyca/ecomm-components";
import * as React from "react";

import * as styles from "./style.css";

export default (props) => {
    return (
        <Row>
            <Col xs={12}>
                <div className={styles.namePlaceholder} />
                <div className={styles.ratingPlaceholder} />
            </Col>
            <Col xs={12} sm={6} md={8}>
                <div className={styles.imagePlaceholder} />
                <div className={styles.pricePlaceholder} />
                <hr className={styles.topHr} />
            </Col>
            <Col xs={12} sm={6} md={4}>
                <div className={styles.availabilityPlaceholder} />
                <hr className={styles.topHr} />

                <div className={styles.overviewPlaceholder} />
                <div className={styles.descriptionPlaceholder} />
                <div className={styles.descriptionPlaceholder} />
                <div className={styles.descriptionPlaceholder} />
            </Col>
        </Row>
    );
};
