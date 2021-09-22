import * as React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { ReactButton } from "../Button/Button";
import { ReactIconButton } from "../ReactIconButton/ReactIconButton";

export const TrackButton: React.FC<any> = (props) => {
    const settedProps = {
        ...props,
        iconName: "checked",
    };

    return props.isTracked ? <ReactIconButton {...settedProps} /> : <ReactButton {...props} />;
};

export default SWReactRootComponent(TrackButton, "TrackButton");
