import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";
import autobind from "autobind-decorator";
import I18n from "components/React/Filters/I18n";
import { SwTrack } from "services/SwTrack";

const SharedDashboardHeaderIconContent = styled.div`
    width: 100%;
    color: rgb(42, 62, 82, 0.8);
    font-size: 14px;
    font-weight: 400;
    line-height: 28px;
`;
const SharedDashboardHeaderIconTopContent = styled.div`
    padding: 24px;
    border-bottom: 1px solid ${colorsPalettes.midnight["50"]};
    margin: 0;
`;
const SharedDashboardHeaderIconBottomContent = styled.div`
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
`;

const popupConfig = {
    cssClass: "Popup-element-wrapper--pro",
    cssClassContent: "Popup-content--pro",
    placement: "bottom",
    width: "416px",
    allowHover: true,
};
interface ISharedDashboardHeaderTooltipWrap {
    ownerName: string;
    onClick: () => void;
    type: string;
}

export default class SharedDashboardHeaderButtonTooltipWrap extends React.PureComponent<
    ISharedDashboardHeaderTooltipWrap,
    any
> {
    constructor(props) {
        super(props);
    }

    @autobind
    getContent() {
        const onClick = () => {
            SwTrack.all.trackEvent("Duplicate Report", "click", this.props.type);
            this.props.onClick();
        };
        const OWNER_NAME = this.props.ownerName;
        return (
            <SharedDashboardHeaderIconContent>
                <SharedDashboardHeaderIconTopContent>
                    <I18n dataObj={{ OWNER_NAME }}>dashboard.sharedWithMe.tooltip.text</I18n>
                </SharedDashboardHeaderIconTopContent>
                <SharedDashboardHeaderIconBottomContent>
                    <Button type="flat" onClick={onClick}>
                        <ButtonLabel>
                            <I18n>dashboard.sharedWithMe.tooltip.duplicateButton</I18n>
                        </ButtonLabel>
                    </Button>
                </SharedDashboardHeaderIconBottomContent>
            </SharedDashboardHeaderIconContent>
        );
    }
    render() {
        return (
            <PopupHoverContainer content={this.getContent} config={popupConfig}>
                {this.props.children}
            </PopupHoverContainer>
        );
    }
}
