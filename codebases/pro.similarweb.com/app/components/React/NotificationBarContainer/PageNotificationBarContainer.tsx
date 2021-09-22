import { NotificationBar } from "@similarweb/ui-components/dist/notification-bar";
import * as React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";

export interface INotificationItem {
    id: string;
    text?: string;
    customComponent?: any;
    onClose?: () => {};
}

export interface INotificationBarContainer {
    pageNotificationList: [INotificationItem];
}

class PageNotificationBarContainer extends Component<INotificationBarContainer, any> {
    protected containerDiv;
    constructor(props, context) {
        super(props, context);
    }
    public render() {
        return (
            <div
                ref={(div) => {
                    this.containerDiv = div;
                }}
            >
                {this.props.pageNotificationList &&
                    this.props.pageNotificationList.map((notification) => {
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
    const pageNotificationList = common.pageNotificationList;
    return {
        pageNotificationList,
    };
}

SWReactRootComponent(
    connect(mapStateToProps, undefined)(PageNotificationBarContainer),
    "PageNotificationBarContainer",
);
