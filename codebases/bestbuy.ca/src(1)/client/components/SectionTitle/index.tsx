import * as React from "react";
import * as styles from "./style.css";
import {classname} from "utils/classname";

export enum TitleAppearance {
    default = "default",
    h1 = "h1",
    d1 = "d1",
    d2 = "d2",
}
export interface Props {
    appearance?: TitleAppearance;
    className?: string;
    extraAttrs?: any;
}

const SectionTitle: React.FunctionComponent<Props> = ({
    appearance = TitleAppearance.default,
    children,
    className = "",
    extraAttrs,
}) => {
    const props = {
        className: classname([styles.sectionTitle, appearance && styles[appearance], className]),
        ...extraAttrs,
    };
    return (
        <>
            {React.Children.map(children, (child) => {
                return React.isValidElement(child) ? React.cloneElement(child, props) : <h2 {...props}>{child}</h2>;
            })}
        </>
    );
};

export default SectionTitle;
