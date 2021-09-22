import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";

const Dot = styled.div`
    width: 8px;
    height: 8px;
    border-radius: 8px;
    background-color: #ff8100;
    position: absolute;
    top: 24px;
    right: 4px;
`;

const WorkspaceDismissDot = (props) => {
    return <div>{props.dismissNotificationDot && <Dot id="dismiss-dot" />}</div>;
};

function mapStateToProps({
    userData: {
        workspaceOptIn: { dismissNotificationDot },
    },
}) {
    return {
        dismissNotificationDot,
    };
}

export default SWReactRootComponent(
    connect(mapStateToProps)(WorkspaceDismissDot),
    "WorkspaceDismissDot",
);
