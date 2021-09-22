import * as React from "react";
import ReactDOM from "react-dom";

const Portal: React.FunctionComponent<{target: HTMLElement}> = ({children, target}) =>
    ReactDOM.createPortal(children, target);

export default Portal;
