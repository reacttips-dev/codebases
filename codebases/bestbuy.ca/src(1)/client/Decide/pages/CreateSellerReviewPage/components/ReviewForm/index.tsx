import {Col} from "@bbyca/ecomm-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Button} from "@bbyca/bbyca-components";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import Divider from "@material-ui/core/Divider";

import StarRate from "components/StarRate";
import TextInput from "components/TextInput";

import {sellerReviewSubmissionStatus as status} from "../../../../constants/Seller";
import * as styles from "./style.css";
import messages from "./translations/messages";
interface Props {
    isLoading: boolean;
    location: string;
    ratingValue: number;
    submissionStatus: string;
    customerName: string;
    reviewText: string;
    canSubmit: boolean;
    selectRatingHandler: (ratingIndex: any) => () => void;
    onChangeHandler: (text: string, name: any) => void;
    onSubmitHandler: (event) => void;
    formatMessage: (message) => string;
}

const ReviewForm = (props: Props) => {
    const invalid = !!(props.submissionStatus === status.invalid);
    const ratingUnselected = invalid && props.ratingValue === 0;

    return (
        <div>
            <div className={`${styles.ratingContainer} ${ratingUnselected ? styles.error : ""} `}>
                <div className={styles.ratingText}>
                    <FormattedMessage {...messages.rating} />
                    :&nbsp;
                    {props.ratingValue > 0 && (
                        <span className={styles.ratingValue}>
                            <FormattedMessage {...messages[`ratingValue${props.ratingValue}`]} />
                        </span>
                    )}
                </div>
                <StarRate rate={props.ratingValue} onClickHandler={props.selectRatingHandler} />
                <div className={styles.instructionText}>
                    <FormattedMessage {...messages.ratingInstruction} />
                </div>
            </div>
            <div className={styles.reviewContainer}>
                <Col xs={12} sm={12} md={12} className={styles.textareaContainer}>
                    <Divider className={styles.divider} />
                    <TextInput
                        name="reviewText"
                        isMultiline={true}
                        label={props.formatMessage(messages.reviewLabel)}
                        defaultValue={props.reviewText}
                        placeholder={props.formatMessage(messages.reviewPlaceholder)}
                        onChangeHandler={props.onChangeHandler}
                        maxLength={500}
                        hasErrors={invalid && props.reviewText.length === 0}
                        errorMessage={props.formatMessage(messages.textFieldEmpty)}
                    />
                </Col>
                <Col xs={12} sm={8} md={6} className={styles.inputContainer}>
                    <TextInput
                        name="customerName"
                        label={props.formatMessage(messages.nameLabel)}
                        defaultValue={props.customerName}
                        placeholder={props.formatMessage(messages.namePlaceholder)}
                        onChangeHandler={props.onChangeHandler}
                        maxLength={50}
                        hasErrors={invalid && props.customerName.length === 0}
                        errorMessage={props.formatMessage(messages.textFieldEmpty)}
                    />
                </Col>
                <Col xs={12} sm={8} md={6} className={styles.inputContainer}>
                    <TextInput
                        name="location"
                        label={props.formatMessage(messages.locationLabel)}
                        defaultValue={props.location}
                        onChangeHandler={props.onChangeHandler}
                        maxLength={50}
                        hasErrors={invalid && props.location.length === 0}
                        errorMessage={props.formatMessage(messages.textFieldEmpty)}
                    />
                </Col>
                <Col xs={12} sm={8} md={6} className={styles.buttonContainer}>
                    <Button
                        className={`${styles.button} ${styles.submitButton}`}
                        onClick={props.onSubmitHandler}
                        appearance={"secondary"}
                        isDisabled={!props.canSubmit}>
                        {props.isLoading ? (
                            <CircularProgress size={24} style={{top: "8px", color: "rgba(0, 0, 0, .87)"}} />
                        ) : (
                            <FormattedMessage {...messages.submit} />
                        )}
                    </Button>
                </Col>
            </div>
        </div>
    );
};

export default ReviewForm;
