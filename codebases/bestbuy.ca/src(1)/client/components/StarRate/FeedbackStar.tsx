import * as React from "react";
import {FeedbackStarFull, FeedbackStarEmpty} from "@bbyca/bbyca-components";
import * as styles from "./style.css";
import {classname, classIf} from "utils/classname";

interface FeedbackStarProps {
    onClickHandler: () => any;
    value: number;
    size?: string;
}

export enum starSize {
    medium = "medium",
    large = "large",
}

const FeedbackStar: React.FunctionComponent<FeedbackStarProps> = ({onClickHandler, value, size}: FeedbackStarProps) => {
    const normalizedValue = parseFloat(value) || 0;
    const starWidth = normalizedValue <= 0 ? 0 : normalizedValue >= 1 ? 100 : normalizedValue * 100;

    return (
        <div
            className={classname([
                styles.ratableStar,
                classIf(styles.mediumStars, size === starSize.medium),
                classIf(styles.largeStars, size === starSize.large),
            ])}>
            <button onClick={onClickHandler}>
                <>
                    <FeedbackStarEmpty className={styles.emptyStar} />
                    {starWidth > 0 && (
                        <div
                            className={styles.partialStar}
                            style={{
                                width: `${starWidth}%`,
                            }}>
                            <FeedbackStarFull className={styles.fullStar} />
                        </div>
                    )}
                </>
            </button>
        </div>
    );
};

export default FeedbackStar;
