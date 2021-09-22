import * as React from "react";
import * as styles from "./styles.css";
import {classname} from "utils/classname";

interface HeadlineProps {
    className?: string;
}
const Headline: React.FC<HeadlineProps> = ({children, className = ""}) => (
    <h3 className={classname([styles.headline, className])}>{children}</h3>
);
export default Headline;
