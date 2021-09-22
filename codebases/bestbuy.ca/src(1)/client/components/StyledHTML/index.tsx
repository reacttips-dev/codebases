import * as React from "react";
import * as styles from "./styles.css";

export interface StyledHTMLProps {
    className?: string;
    body?: string;
}

const StyledHTML: React.FunctionComponent<StyledHTMLProps> = ({className = "", body = "", children}) => {
    const classNames = `${className} ${styles.text}`;
    return children ? (
        <div className={classNames}>{children}</div>
    ) : (
        <div className={classNames} dangerouslySetInnerHTML={{__html: body}} />
    );
};

export default StyledHTML;
