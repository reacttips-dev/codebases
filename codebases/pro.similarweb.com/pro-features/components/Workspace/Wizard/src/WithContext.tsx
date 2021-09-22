import * as PropTypes from "prop-types";
import React from "react";

type ITranslate = (key: string) => string;
type ITrack = (category: string, action: string, name: string) => void;

export interface IWizardContextType {
    translate: PropTypes.Validator<ITranslate>;
    track: PropTypes.Validator<ITrack>;
    linkFn: PropTypes.Validator<any>;
}

interface IWithContext {
    ({ children }, context): any;
    contextTypes?: IWizardContextType;
}

export const WithContext: IWithContext = ({ children }, context) => {
    return children(context);
};

export const contextTypes = {
    translate: PropTypes.func.isRequired,
    track: PropTypes.func.isRequired,
    linkFn: PropTypes.func,
};

WithContext.contextTypes = contextTypes;
