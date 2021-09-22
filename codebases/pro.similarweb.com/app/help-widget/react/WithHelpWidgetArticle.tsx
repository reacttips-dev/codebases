import SWReactRootComponent from "decorators/SWReactRootComponent";
import React from "react";
import { withHelpWidgetArticle } from "./hocs/withHelpWidgetArticle";

const NullComponent: React.FC = () => null;

interface IProps {
    articleId: string;
}

export const WithHelpWidgetArticle = withHelpWidgetArticle<IProps>(({ articleId }) => articleId)(
    NullComponent,
);
WithHelpWidgetArticle.displayName = "WithHelpWidgetArticle";

export default SWReactRootComponent(WithHelpWidgetArticle, "WithHelpWidgetArticle");
