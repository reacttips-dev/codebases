import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Trash, Button} from "@bbyca/bbyca-components";
import {classname as cx} from "utils/classname";
import messages from "./translations/messages";
import * as styles from "./styles.css";

export interface RemoveSavedItemButtonProps {
    onClick: React.MouseEventHandler;
    sku: string;
    className?: string;
}

const RemoveSavedItemButton: React.FC<RemoveSavedItemButtonProps> = ({onClick, className, sku}): React.ReactElement => {
    return (
        <Button
            className={cx([styles.removeSavedItemButton, className])}
            appearance="transparent"
            onClick={onClick}
            data-automation="removed-saved-item-button">
            <Trash color="blue" className={styles.removeSavedItemButtonIcon} />
            <FormattedMessage {...messages.buttonText} />
        </Button>
    );
};

export default RemoveSavedItemButton;
