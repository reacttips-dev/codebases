import * as React from "react";

import * as styles from "./styles.css";

export interface Props {
    onClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    className?: string;
    href?: string;
    children?: React.ReactNode;
}

export const ContactBlock = (props: Props) => (
    <a onClick={props.onClick} className={styles.link} href={props.href}>
        <div className={`${styles.boxComponent} ${props.className}`}>
            {props.children}
        </div>
    </a>
);

export default ContactBlock;
