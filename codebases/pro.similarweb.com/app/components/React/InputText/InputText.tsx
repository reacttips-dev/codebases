import * as React from "react";
import { StatelessComponent } from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";

export const InputText: StatelessComponent<any> = (props) => {
    const { placeholder, inputText, onChange, onFocus, onBlur } = props; //destructuring is here because onFocus & onBlur are optional
    return (
        <input
            type="text"
            placeholder={placeholder}
            value={inputText}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
        />
    );
};
SWReactRootComponent(InputText, "InputText");
