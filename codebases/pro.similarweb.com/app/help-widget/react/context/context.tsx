import React from "react";

type releaseFn = () => void;

export interface IHelpWidgetContextApi {
    retainWithArticle: (id: string) => releaseFn;
    retain: () => releaseFn;
}

export const HelpWidgetContext = React.createContext<IHelpWidgetContextApi>(undefined);
