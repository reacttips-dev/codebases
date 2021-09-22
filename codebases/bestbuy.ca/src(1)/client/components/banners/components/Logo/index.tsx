import * as React from "react";
import * as styles from "./styles.css";
import {classname} from "utils/classname";

interface LogoProps {
    alternateText?: string;
    className?: string;
    src: string;
}

const Logo: React.FC<LogoProps> = ({alternateText = "", className, src}) => (
    <div className={classname([className, styles.logoContainer])}>
        <img className={styles.logo} alt={alternateText} src={src} />
    </div>
);
export default Logo;
