import * as React from "react";
import { default as MaterialUISnackbar } from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import { NotificationState as NotificationProps } from "../../reducers";
import Button from "@material-ui/core/Button";
import * as styles from "./style.css";

interface Props {
    notification: NotificationProps;
    handleRequestClose: (e) => void;
}

export const Snackbar = (props: Props) => {
    let snackbarAction;
    if (props.notification.action) {
        snackbarAction =
            <Button
                onClick={props.notification.action.onAction}
                className={styles.snackBarActionButton}
                classes={{
                    label: styles.snackBarActionButtonText,
                }}
            >
                {props.notification.action.name}
             </Button>;
    }
    return (
        <MaterialUISnackbar
            open={props.notification.open}
            autoHideDuration={props.notification.autoHideDuration && props.notification.autoHideDuration}
            onClose={props.handleRequestClose}
        >
            <SnackbarContent message={props.notification.message} action={snackbarAction} />
        </MaterialUISnackbar>
    );
};

export default Snackbar;
