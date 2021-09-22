import { HelpWidgetContext } from "help-widget/react/context/context";
import { getDisplayName } from "helpers/react/getDisplayName";
import { ComponentType, useContext, useEffect } from "react";

const isFunc = (x: unknown): x is Function => typeof x === "function";

type ArticleId<P> = ((props: P) => string) | string;

export const withHelpWidgetArticle = <P extends {}>(articleId: ArticleId<P>) => (
    WrappedComponent: ComponentType<P>,
): ComponentType<P> => {
    const NewComponent: ComponentType<P> = (props) => {
        const helpWidgetApi = useContext(HelpWidgetContext);

        useEffect(() => {
            const release = helpWidgetApi.retainWithArticle(
                isFunc(articleId) ? articleId(props) : articleId,
            );
            return release;
        }, []);

        return <WrappedComponent {...props} />;
    };
    NewComponent.displayName = `withHelpWidgetArticle(${getDisplayName(WrappedComponent)})`;

    return NewComponent;
};
