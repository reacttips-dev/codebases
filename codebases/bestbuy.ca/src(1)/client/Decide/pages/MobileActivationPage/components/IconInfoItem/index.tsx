import * as React from "react";

import * as styles from "./styles.css";
import {Col, Row, SvgIconProps} from "@bbyca/bbyca-components";
import {SvgColors} from "@bbyca/bbyca-components/src/SvgIcons/index";

interface OwnProps {
    Icon: React.FunctionComponent<SvgIconProps>;
    iconColor: SvgColors;
}

type InfoItemProps = React.PropsWithChildren<OwnProps>;

const IconInfoItem: React.FC<InfoItemProps> = ({Icon, iconColor, children}) => {
    return (
        <div className={styles.iconInfoItem}>
            <Row className={styles.row}>
                <Col xs={2} className={styles.column}>
                    <Icon color={iconColor} className={styles.icon} />
                </Col>
                <Col xs={10} className={styles.column}>
                    {children}
                </Col>
            </Row>
        </div>
    );
};

export default IconInfoItem;
