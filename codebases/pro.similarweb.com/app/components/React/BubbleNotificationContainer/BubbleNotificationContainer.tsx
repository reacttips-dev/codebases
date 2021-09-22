import { colorsPalettes } from "@similarweb/styles";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";

export interface IBubbleItem {
    id: string;
    bubbleProps: any;
    customComponent: any;
}

export interface IBubbleContainer {
    bubblesNotificationList: [IBubbleItem];
}

class BubbleNotificationContainer extends PureComponent<IBubbleContainer, any> {
    constructor(props, context) {
        super(props, context);
    }

    public render() {
        return (
            <div>
                {this.props.bubblesNotificationList &&
                    this.props.bubblesNotificationList.map((bubble) => {
                        const Bubble = bubble.customComponent;
                        return <Bubble key={bubble.id} {...bubble.bubbleProps} />;
                    })}
            </div>
        );
    }
}

function mapStateToProps({ common }) {
    const bubblesNotificationList = common.bubblesNotificationList;
    return {
        bubblesNotificationList,
    };
}

function mapDispatchToProps(dispatch) {
    return {};
}

SWReactRootComponent(
    connect(mapStateToProps, mapDispatchToProps)(BubbleNotificationContainer),
    "BubbleNotificationContainer",
);
