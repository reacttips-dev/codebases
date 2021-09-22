import React from "react";
import { SecondaryBarType } from "reducers/_reducers/SecondaryBarReducer";

const noopFunc = () => void 0;

export interface ISecondaryBarContext {
    params: any;
    currentPage: string;
    currentModule: string;
    toggleSecondaryBar: (isOpened: boolean) => void;
    setSecondaryBarType: (type: SecondaryBarType) => void;
}

export const SecondaryBarContext = React.createContext<ISecondaryBarContext>({
    params: null,
    currentPage: null,
    currentModule: null,
    toggleSecondaryBar: noopFunc,
    setSecondaryBarType: noopFunc,
});
