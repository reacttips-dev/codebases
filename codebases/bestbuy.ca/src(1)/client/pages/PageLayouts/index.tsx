import * as React from "react";
export {default as TwoColumn} from "./TwoColumn";
export {default as SingleColumn} from "./SingleColumn";

export enum LayoutTypes {
    singleColumn = "singleColumn",
    twoColumn = "twoColumn",
}
export interface GlobalStyles {
    browserSizeLayout: string;
    siteSizeLayout: string;
    layoutName?: LayoutTypes;
    contentSections: {
        textContent: string;
        backgroundMountedContent: string;
    };
}

export const GlobalStyles = React.createContext<GlobalStyles>({
    browserSizeLayout: "",
    siteSizeLayout: "",
    contentSections: {
        textContent: "",
        backgroundMountedContent: "",
    },
});
