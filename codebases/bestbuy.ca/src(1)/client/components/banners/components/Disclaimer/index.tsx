import * as React from "react";
import {classname} from "utils/classname";
import * as styles from "./style.css";

interface Props {
    text: string;
    className?: string;
}

const Disclaimer: React.FC<Props> = ({text, className}) => (
    <p className={classname([styles.disclaimer, className])}>{text}</p>
);

export default Disclaimer;
