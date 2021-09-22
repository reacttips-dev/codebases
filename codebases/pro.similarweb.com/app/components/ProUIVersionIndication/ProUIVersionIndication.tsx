import * as React from "react";
import { UIVersionIndication } from "../../../.pro-features/components/UIVersionIndication/src/UIVersionIndication";
import SWReactRootComponent from "../../decorators/SWReactRootComponent";

function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) {
        return parts.pop().split(";").shift();
    }
}

const UI_VERSION_COOKIE_NAME = "X-SW-UI-Version";
const DISABLE_FLAG = "disableUIVersionIndicator";

const Component = React.memo(() => {
    let version = getCookie(UI_VERSION_COOKIE_NAME);
    if (localStorage && localStorage.getItem(DISABLE_FLAG) === "true") {
        version = null;
    }
    return <UIVersionIndication UIVersion={version} />;
});

export default SWReactRootComponent(Component, "UIVersionIndication");
