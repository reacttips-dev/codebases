/**
 * Created by dannyr on 13/12/2016.
 */

import * as React from "react";
import { ConfirmationTooltipContent } from "./ConfirmationTooltipContent";
import { PopupClickContainer } from "@similarweb/ui-components/dist/popup-click-container";

export class ConfirmationTooltip extends React.Component<any, any> {
    onCancel = () => {
        this.props.onCancel();
    };

    render() {
        return (
            <PopupClickContainer
                content={() => (
                    <ConfirmationTooltipContent {...this.props} onCancel={this.onCancel} />
                )}
                config={{ enabled: true, placement: "right", cssClass: this.props.cssClass }}
            >
                {this.props.children}
            </PopupClickContainer>
        );
    }
}
