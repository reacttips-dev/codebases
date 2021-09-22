import { LockBadge } from "@similarweb/ui-components/dist/tabs";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import * as React from "react";

const TabLockBadge = ({ text, color }) => {
    return <LockBadge text={text} color={color} />;
};

SWReactRootComponent(TabLockBadge, "TabLockBadge");
export default TabLockBadge;
