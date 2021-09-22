import * as React from "react";
import * as propTypes from "prop-types";

const WithTranslation: any = ({ children }, { translate }) => children(translate);

WithTranslation.contextTypes = {
    translate: propTypes.func.isRequired,
};
WithTranslation.propTypes = {
    children: propTypes.func.isRequired,
};

export default WithTranslation;
