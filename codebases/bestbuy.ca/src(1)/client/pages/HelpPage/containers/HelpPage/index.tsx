import * as React from "react";
import {default as HelpPageComponent} from "../../";
import {WithRouterProps} from "react-router";

const HelpPage = (props: WithRouterProps) => {
    return <HelpPageComponent showNav={true} {...props} />;
};

export default HelpPage;
