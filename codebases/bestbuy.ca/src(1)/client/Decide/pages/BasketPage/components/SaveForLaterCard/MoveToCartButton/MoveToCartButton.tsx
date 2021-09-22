import * as React from "react";
import {FormattedMessage} from "react-intl";
import {ArrowUp, Button} from "@bbyca/bbyca-components";

import {classname as cx} from "utils/classname";
import messages from "./translations/messages";

import * as styles from "./styles.css";

export interface MoveToCartButtonProps {
    onClick: React.MouseEventHandler;
    className?: string;
}

const MoveToCartButton: React.FC<MoveToCartButtonProps> = ({onClick, className}): React.ReactElement => {
    return (
        <Button
            className={cx([styles.moveButton, className])}
            appearance="transparent"
            onClick={onClick}
            data-automation="move-to-cart-button">
            <ArrowUp color="blue" className={styles.moveButtonIcon} />
            <FormattedMessage {...messages.buttonText} />
        </Button>
    );
};

export default MoveToCartButton;
