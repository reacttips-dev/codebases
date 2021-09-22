import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { SWReactIcons } from "@similarweb/icons";
import { PopupHoverContainer } from "@similarweb/ui-components/dist/popup-hover-container";
import styled from "styled-components";
import autobind from "autobind-decorator";

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
const SharedDashboardHeaderIconWrap: any = styled.div`
    margin-left: 10px;
`;

const popupConfig = {
    cssClass: "Popup-element-wrapper--pro",
    cssClassContent: "Popup-content--pro",
    placement: "bottom",
    width: "416px",
    allowHover: true,
};
export interface ISharedDashboardHeaderIcon {
    topContent: JSX.Element;
    bottomContent: JSX.Element;
    icon: string;
    iconWidth?: string;
}
@SWReactRootComponent
export class SharedDashboardHeaderIcon extends React.PureComponent<
    ISharedDashboardHeaderIcon,
    any
> {
    constructor(props) {
        super(props);
    }

    @autobind
    getContent() {
        return (
            <SharedDashboardHeaderIconContent>
                <SharedDashboardHeaderIconTopContent>
                    {this.props.topContent}
                </SharedDashboardHeaderIconTopContent>
                <SharedDashboardHeaderIconBottomContent>
                    {this.props.bottomContent}
                </SharedDashboardHeaderIconBottomContent>
            </SharedDashboardHeaderIconContent>
        );
    }
    render() {
        return (
            <PopupHoverContainer content={this.getContent} config={popupConfig}>
                <div>
                    <SharedDashboardHeaderIconWrap width={this.props.iconWidth}>
                        <SWReactIcons iconName={this.props.icon} size="xs" />
                    </SharedDashboardHeaderIconWrap>
                </div>
            </PopupHoverContainer>
        );
    }
}
