import * as _ from "lodash";
import * as propTypes from "prop-types";
import React, { Component, createContext } from "react";

export type TranslateFn = (
    transKey: string,
    values?: Record<string, any>,
    defaultValue?: string,
) => string;

export const TranslationContext = createContext<{ t: TranslateFn }>({
    t: (transKey: string) => transKey,
});

interface ITranslationProviderProps {
    translate: (key, object?) => string;
}

export default class TranslationProvider extends Component<ITranslationProviderProps, any> {
    public static childContextTypes = {
        translate: propTypes.func,
    };

    public static defaultProps = {
        translate: _.identity,
    };

    public getChildContext() {
        return { translate: this.props.translate };
    }

    public render() {
        const { children, translate } = this.props;

        return (
            <TranslationContext.Provider value={{ t: translate }}>
                {children}
            </TranslationContext.Provider>
        );
    }
}
