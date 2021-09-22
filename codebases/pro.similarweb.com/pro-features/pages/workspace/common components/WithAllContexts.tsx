import * as propTypes from "prop-types";
import * as React from "react";

const WithAllContexts: any = ({ children }, context) => children({ ...context, ...context.linkFn });

WithAllContexts.contextTypes = {
    translate: propTypes.func.isRequired,
    track: propTypes.func.isRequired,
    linkFn: propTypes.any,
    components: propTypes.object.isRequired,
};
WithAllContexts.propTypes = {
    children: propTypes.func.isRequired,
};
export default WithAllContexts;
