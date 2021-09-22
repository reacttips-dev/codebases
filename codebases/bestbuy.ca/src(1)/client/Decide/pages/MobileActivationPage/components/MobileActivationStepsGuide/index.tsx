import * as React from "react";
import {FormattedMessage} from "react-intl";

import * as styles from "./styles.css";
import messages from "./translations/messages";
import IconInfoItem from "../IconInfoItem";
import {Store, Blog, Phone, Row, Col} from "@bbyca/bbyca-components";


const MobileActivationStepsGuide: React.FC = () => (
    <div className={styles.mobileActivationStepsGuide}>
        <Row className={styles.row}>
            <Col xs={12} sm={4} className={styles.column}>
                <div data-automation="mobile-activation-first-step-guide">
                    <IconInfoItem Icon={Blog} iconColor={"blue"}>
                        <FormattedMessage {...messages.stepOne} />
                    </IconInfoItem>
                </div>
            </Col>
            <Col xs={12} sm={4} className={styles.column}>
                <div data-automation="mobile-activation-second-step-guide">
                    <IconInfoItem Icon={Phone} iconColor={"blue"}>
                        <FormattedMessage {...messages.stepTwo} />
                    </IconInfoItem>
                </div>
            </Col>
            <Col xs={12} sm={4} className={styles.column}>
                <div data-automation="mobile-activation-third-step-guide">
                    <IconInfoItem Icon={Store} iconColor={"blue"}>
                        <FormattedMessage {...messages.stepThree} />
                    </IconInfoItem>
                </div>
            </Col>
        </Row>
    </div>
);

export default MobileActivationStepsGuide;
