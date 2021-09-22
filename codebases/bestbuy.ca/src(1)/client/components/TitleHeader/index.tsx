import * as React from "react";
import * as styles from "./style.css";

export interface TitleHeaderProps {
    title?: string;
    children?: JSX.Element | React.Component | JSX.Element[];
    noPaddingTop?: boolean;
    noPaddingBottom?: boolean;
    className?: string;
}

const TitleHeader = ({title, children, noPaddingTop, noPaddingBottom, className = ""}: TitleHeaderProps) => {
    // Conditionally put more padding below h1
    const titlePaddingBottom = children ? 8 : 0;
    let containerClassName = noPaddingTop ? `${styles.container} ${styles.noPaddingTop}` : styles.container;
    containerClassName = noPaddingBottom ? `${containerClassName} ${styles.noPaddingBottom}` : containerClassName;
    const titleHeader =
        title || children ? (
            <div className={`${containerClassName} ${className}`}>
                {title && (
                    <h1 className={styles.title} style={{paddingBottom: `${titlePaddingBottom}px`}}>
                        {title}
                    </h1>
                )}
                {children}
            </div>
        ) : null;

    return titleHeader;
};

(TitleHeader as React.SFC).displayName = "TitleHeader";

export default TitleHeader;
