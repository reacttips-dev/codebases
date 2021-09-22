import React from "react";

interface IUseFocusResults {
    htmlElementReference: React.MutableRefObject<HTMLInputElement>;
    setFocus: { (): void };
}

interface IUseFocus {
    (): IUseFocusResults;
}

const DEFAULT_INPUT_FOCUS_PARAMETERS = { preventScroll: true };

export const useFocus: IUseFocus = (inputFocusParameters = DEFAULT_INPUT_FOCUS_PARAMETERS) => {
    const htmlElementReference = React.useRef<HTMLInputElement>(null);
    const setFocus = () => {
        htmlElementReference.current?.focus(inputFocusParameters);
    };
    return { htmlElementReference, setFocus };
};
