import * as React from "react";

import { IconType } from "components/MessageBox";

import MessageBox from "../MessageBox";

interface Props {
    content: any;
    icon: IconType;
    contentProps?: any;
}

export default function(props: Props) {
    const { content, icon, contentProps = {} } = props;

    if (!content) {
        return null;
    }

    const { messageTitle = "", messageBody = "", event, ctaText } = content;

    if (messageTitle || messageBody) {
        const ctaProps = event && ctaText ? {
            event,
            ctaText,
        } : {};

        return <MessageBox
            messageIcon={icon}
            messageTitle={messageTitle}
            messageDetails={messageBody}
            {...ctaProps}
            {...contentProps}
        />;
    }

    return null;
}
