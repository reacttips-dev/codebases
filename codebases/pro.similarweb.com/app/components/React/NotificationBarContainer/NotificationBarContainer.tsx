import { colorsPalettes } from "@similarweb/styles";
import { NotificationBar } from "@similarweb/ui-components/dist/notification-bar";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { updateNotificationBarHeight } from "../../../actions/notificationBarActions";

export interface INotificationItem {
    id: string;
    text?: string;
    customComponent?: any;
    onClose?: () => {};
}

export interface INotificationBarContainer {
    notificationList: [INotificationItem];
    updateNotificationBarHeight: (height: number) => void;
}

class NotificationBarContainer extends Component<INotificationBarContainer, any> {
    protected containerDiv;
    constructor(props, context) {
        super(props, context);
    }

    public componentDidUpdate() {
        this.props.updateNotificationBarHeight(this.containerDiv.clientHeight);
    }

    public render() {
        return (
            <div
                ref={(div) => {
                    this.containerDiv = div;
                }}
            >
                {this.props.notificationList &&
                    this.props.notificationList.map((notification) => {
                        const CustomComponent = notification.customComponent;
                        return CustomComponent ? (
                            <CustomComponent key={notification.id} {...notification} />
                        ) : (
                            <NotificationBar key={notification.id} onClose={notification.onClose}>
                                {notification.text}
                            </NotificationBar>
                        );
                    })}
            </div>
        );
    }
}

function mapStateToProps({ common }) {
    const notificationList = common.notificationList;
    return {
        notificationList,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateNotificationBarHeight: (height) => {
            dispatch(updateNotificationBarHeight(height));
        },
    };
}

SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(NotificationBarContainer),
    "NotificationBarContainer",
);
