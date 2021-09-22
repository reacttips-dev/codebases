import * as React from "react";

import * as styles from "./styles.css";

export interface LinkButtonProps {
    text: string | React.ReactNode;
    icon?: JSX.Element;
    automationId?: string;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const LinkButton: React.FC<LinkButtonProps> = ({onClick, text, icon = null, automationId}): React.ReactElement => {
    return (
        <button onClick={onClick} className={styles.linkButton} data-automation={automationId}>
            <span className={styles.content}>
                {icon}
                {text}
            </span>
        </button>
    );
};

export default LinkButton;
