import * as React from "react";
import {ReactNode} from "react-redux";

interface ActivationOptionProps {
    header: ReactNode;
    body: ReactNode;
}

export const ActivationOption: React.FC<ActivationOptionProps> = ({header, body}) => (
    <>
        <h2>{header}</h2>
        <p>{body}</p>
    </>
);
