import {FormItemHoc, FormItemProps} from "@bbyca/bbyca-components";
import * as React from "react";
import {FormattedMessage} from "react-intl";

import StarRate from "components/StarRate/";

import messages from "./translations/messages";
import * as styles from "./style.css";

export interface ReviewStarRateProps extends FormItemProps {
    count?: number;
    onClickHandler?: (ratingIndex: number) => (e: React.MouseEvent) => void;
}

const ReviewStarRate = (props: ReviewStarRateProps) => {
    const numericRating = parseInt(props.value, 10) || 0;
    const onClickHandler = (ratingIndex: number) => (e: React.MouseEvent) => {
        e.preventDefault();
        const {handleSyncChange, name} = props;
        const rating = ratingIndex + 1;
        if (handleSyncChange) {
            handleSyncChange(name, rating.toString());
        }
    };

    return (
        <div className={styles.ratingContent}>
            <h3 className={styles.overallRatingLabel}>
                <FormattedMessage {...messages.overallRating} />
            </h3>
            <div className={"radio-group"} role={"group"} aria-label={"radio group"}>
                <StarRate
                    // StarRate rate prop expects number, we need to parse back as Int when rate prop comes back down from HOC state
                    rate={numericRating}
                    hideRatingScoreAndReviewCount={true}
                    onClickHandler={onClickHandler}
                    size={"large"}
                />
            </div>
        </div>
    );
};

export default FormItemHoc()(ReviewStarRate);
