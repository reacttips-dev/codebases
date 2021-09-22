import * as React from "react";
import * as styles from "./styles.css";
import {classname} from "utils/classname";

export interface FlipCardProps {
    animationInt?: number;
    className?: string;
    minCharacters?: number;
    val: string | number;
}

const numberFormatter = (minCharacters: number) => (val: string | number) => {
    const valLength = val.toString().length;
    const n = valLength > minCharacters ? valLength : minCharacters;
    return ("0".repeat(n) + val).slice(n * -1);
};

const Card: React.FC<{className?: string}> = ({children, className}) => (
    <div className={classname([styles.card, className])}>{children}</div>
);

export const getUpdatedChars = (current: string, prev: string): boolean[] =>
    [...Array(prev.length)].fill("").map((item, index) => current[index] !== prev[index]);

const FlipCard: React.FC<FlipCardProps> = ({animationInt = 900, className = "", minCharacters = 1, val}) => {
    const formatVal = numberFormatter(minCharacters);
    const formattedVal = formatVal(val);
    const [currentVal, setCurrentVal] = React.useState(formattedVal);
    const [nextVal, setNextVal] = React.useState(formattedVal);
    const prevCountRef = React.useRef(formattedVal);
    const [transition, setTransition] = React.useState(new Array(formatVal.length).fill(false));
    let timeout = 0;

    React.useEffect(() => {
        const newFormattedVal = formatVal(val);
        setNextVal(newFormattedVal);
        setTransition(getUpdatedChars(newFormattedVal, prevCountRef.current));
        prevCountRef.current = formatVal(newFormattedVal);
        window.clearTimeout(timeout);
        timeout = window.setTimeout(() => {
            setCurrentVal(formatVal(val));
            setTransition(transition.fill(false));
        }, animationInt);

        return () => window.clearTimeout(timeout);
    }, [val]);

    return (
        <div className={classname([styles.unit, className])}>
            {currentVal.split("").map((currentValue, index) => (
                <div key={"cube-" + index} className={classname([styles.cube, transition[index] && styles.flip])}>
                    <Card key={"card-current" + index} className={styles.current}>
                        {currentValue}
                    </Card>
                    <Card key={"card-next" + index} className={styles.next}>
                        {nextVal[index]}
                    </Card>
                </div>
            ))}
        </div>
    );
};

export default FlipCard;
