import * as React from "react";
import AgeGate, {AgeGateProps} from "./AgeGate";
export {default as AgeGatePortal} from "./components/AgeGatePortal";

export const withAgeGate = <T extends {}>(
    Component: React.ComponentType<T>,
): React.FunctionComponent<T & AgeGateProps> => {
    return (props) => (
        <AgeGate {...props}>
            <Component {...props} />
        </AgeGate>
    );
};

export default withAgeGate;
