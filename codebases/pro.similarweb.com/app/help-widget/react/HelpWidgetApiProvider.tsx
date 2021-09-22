import noop from "lodash/noop";
import React, { ComponentType, useMemo } from "react";
import { connect } from "react-redux";
import { IHelpWidget } from "../HelpWidget";
import { decrement, increment } from "../store/actions/retainCount";
import { HelpWidgetContext, IHelpWidgetContextApi } from "./context/context";

interface IHelpWidgetApiProviderPureProps extends IHelpWidgetApiProviderProps {
    count: number;
    previousCount: number | undefined;
    incrementCount: () => void;
    decrementCount: () => void;
}

const HelpWidgetApiProviderPure: React.FC<IHelpWidgetApiProviderPureProps> = ({
    children,
    incrementCount,
    decrementCount,
    helpWidget,
}) => {
    const contextApi: IHelpWidgetContextApi = useMemo(() => {
        const release = decrementCount;
        const retain = () => {
            incrementCount();
            return release;
        };

        return {
            retain,
            retainWithArticle: (articleId) => {
                if (articleId) {
                    if (helpWidget.isArticleAvailable(articleId)) {
                        helpWidget.goToArticle(articleId);
                        if (!helpWidget.isArticleSeen(articleId)) {
                            helpWidget.open();
                        }

                        return retain();
                    }
                } else {
                    // tslint:disable-next-line:no-console
                    console.error(`articleId cannot be ${articleId}`);
                }

                return noop;
            },
        };
    }, []);

    return <HelpWidgetContext.Provider value={contextApi}>{children}</HelpWidgetContext.Provider>;
};

interface IHelpWidgetApiProviderProps {
    children: React.ReactNode;
    helpWidget: IHelpWidget;
}

export const HelpWidgetApiProvider: ComponentType<IHelpWidgetApiProviderProps> = connect(
    null,
    {
        incrementCount: increment,
        decrementCount: decrement,
    },
    (stateProps, { incrementCount, decrementCount, ...dispatchProps }, ownProps) => ({
        ...stateProps,
        ...ownProps,
        ...dispatchProps,
        incrementCount: () => incrementCount(ownProps.helpWidget),
        decrementCount: () => decrementCount(ownProps.helpWidget),
    }),
)(HelpWidgetApiProviderPure);
