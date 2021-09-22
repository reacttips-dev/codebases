import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import * as React from "react";
import { InjectedIntlProps, injectIntl } from "react-intl";
import * as styles from "./style.css";
import messages from "./translations/messages";

export interface BackButtonProps {
    canGoBack: boolean;
    onClick: (e) => void;
}

export class BackButton extends React.Component<BackButtonProps & InjectedIntlProps> {
    public render() {
        if (!this.props.canGoBack) {
            return null;
        }
        return (
            <Button
                className={`x-back-link ${styles.button} ${styles.backButton}`}
                onClick={this.props.onClick}
                variant="flat"
            >
                <KeyboardArrowLeft className={styles.backButtonIcon} />
                <span>
                    {this.props.intl.formatMessage(messages.backButton)}
                </span>
            </Button>
        );
    }
}

export default injectIntl(BackButton);
