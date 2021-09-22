import * as React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { SharedDashboardHeaderIcon } from "./SharedDashboardHeaderIcon";
import I18n from "../../components/React/Filters/I18n";
import { SwTrack } from "services/SwTrack";

@SWReactRootComponent
export default class SharedDashboardWithMe extends React.PureComponent<any, any> {
    constructor(props) {
        super(props);
    }
    getContent() {
        const onClick = () => {
            SwTrack.all.trackEvent("Duplicate Report", "click", "lock icon");
            this.props.onClick();
        };
        const OWNER_NAME = this.props.ownerName;
        return {
            topContent: <I18n dataObj={{ OWNER_NAME }}>dashboard.sharedWithMe.tooltip.text</I18n>,
            bottomContent: (
                <Button type="flat" onClick={onClick}>
                    <ButtonLabel>
                        <I18n>dashboard.sharedWithMe.tooltip.duplicateButton</I18n>
                    </ButtonLabel>
                </Button>
            ),
        };
    }
    render() {
        return <SharedDashboardHeaderIcon icon="locked" {...this.getContent()} />;
    }
}
