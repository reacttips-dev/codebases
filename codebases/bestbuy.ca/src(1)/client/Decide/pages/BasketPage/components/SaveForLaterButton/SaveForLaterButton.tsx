import * as React from "react";
import {FormattedMessage} from "react-intl";
import {Bookmark} from "@bbyca/bbyca-components";
import messages from "./translations/messages";
import {LinkButton} from "../LinkButton";

export interface SaveForLaterButtonProps {
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const SaveForLaterButton: React.FC<SaveForLaterButtonProps> = ({onClick}): React.ReactElement => {
    return (
        <LinkButton
            automationId="s4l-button"
            text={<FormattedMessage {...messages.buttonText} />}
            icon={<Bookmark color="blue" />}
            onClick={onClick}
        />
    );
};

export default SaveForLaterButton;
