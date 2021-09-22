import * as React from "react";
import StarRate from "../../components/StarRate";
import {starSize} from "../StarRate/FeedbackStar";
import * as styles from "./style.css";

interface OverallRatingSummaryProps {
    rate: number | string;
    count: number;
}

export const OverallRatingSummary = (props: OverallRatingSummaryProps) => {
    const {count, rate} = props;

    return (
        <section className={styles.overallRatingSummary}>
            <StarRate rate={rate} size={starSize.medium} />
            <div className={styles.overallRating}>
                {rate} ({count})
            </div>
        </section>
    );
};

export default OverallRatingSummary;
