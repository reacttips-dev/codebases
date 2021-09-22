import * as React from "react";
import {default as HelpPageComponent} from "../../";
import {WithRouterProps} from "react-router";

const HelpLandingPage = (props: WithRouterProps) => {
    return <HelpPageComponent showNav={false} {...props} />;
};

export default HelpLandingPage;
