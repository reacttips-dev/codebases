import * as React from "react";
import {classname} from "utils/classname";
import * as styles from "./style.css";

export interface AnchorLink {
    anchorTitle: string;
    id: string;
}

interface AnchorNavProps {
    title?: string;
    className?: string;
    anchorLinks: AnchorLink[];
}

const AnchorNav: React.FunctionComponent<AnchorNavProps> = ({title, anchorLinks, className = ""}) => {
    const handleClick = (id: string, e: React.MouseEvent) => {
        e.preventDefault();
        const el = document.getElementById(id);
        if (!!window.history) {
            window.history.pushState(null, "", `#${id}`);
        }
        if (!!el && !!el.scrollIntoView) {
            el.scrollIntoView({block: "start", behavior: "smooth"});
        }
    };

    return (
        <div className={classname([className, styles.anchorNavWrp])}>
            {!!title && <h2 className={styles.navTitle}>{title}</h2>}
            <ul className={styles.anchorNav}>
                {anchorLinks.map(({anchorTitle, id}) => {
                    return (
                        <li key={id}>
                            <a href={`#${id}`} onClick={(e: React.MouseEvent) => handleClick(id, e)}>
                                {anchorTitle}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default AnchorNav;
