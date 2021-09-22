import * as React from "react";
import {useEffect, useState, useCallback} from "react";
import {IBrowser as ScreenSize} from "redux-responsive";
import messages from "./translations/messages";
import {FormattedMessage, injectIntl, InjectedIntlProps, InjectedIntl} from "react-intl";
import ReviewStarRate from "../ReviewStarRate/";
import ReviewGuidelines from "../ReviewGuidelines";
import Link from "components/Link";
import {
    Form,
    Input,
    TextArea,
    Button,
    required,
    RadioButton,
    isValidEmailFormat,
    RadioGroup,
} from "@bbyca/bbyca-components";
import {Key} from "@bbyca/apex-components";
import {EventTypes} from "@bbyca/apex-components/dist/models";
import {getHelpTopicsId} from "@bbyca/apex-components/dist/utils/helpTopics";
import {CmsEnvironment} from "utils/environment";
import MessageBox, {IconType} from "components/MessageBox";
import {ProductReviewFormFields, FormErrorCodes} from "models";
import {classIf, classname} from "utils/classname";
import {QueryParams} from "utils/queryString";
import * as styles from "./style.css";
import KeyConsiderations from "../../../../components/KeyConsiderations";
import {FEATURE_TOGGLES} from "config/featureToggles";
import FeatureToggle from "components/FeatureToggle";

export interface FormError {
    Field: ProductReviewFormFields | null;
    ErrorCode: FormErrorCodes;
    FormErrors: FormErrorCodes[];
}

interface GlobalFormErrorMessage {
    title: string;
    detail: string;
}

interface ReviewFormProps {
    screenSize: ScreenSize;
    onGuidelinesClick: (event: any) => void;
    formatMessage: InjectedIntl["formatMessage"];
    onFormSubmit?: (type: any, e: any, data: any) => Promise<void>;
    env: CmsEnvironment;
    bazaarVoiceEnabled?: boolean;
    showGuidelines: boolean;
    formError?: FormError;
    verifiedPurchaserQueryParams: VerifiedPurchaserQueryParams;
    campaignId?: string | null;
}

interface VerifiedPurchaserQueryParams extends QueryParams {
    email: string;
    token: string;
    verifiedPurchaser: string;
}

const arrayToObject = (array: FormErrorCodes[]) =>
    array.reduce((obj, item) => {
        obj[item.Field] = item;
        return obj;
    }, {});

const defaultVerifiedPurchaserQueryParams: VerifiedPurchaserQueryParams = {
    email: "",
    token: "",
    verifiedPurchaser: "",
};

const ReviewForm: React.FC<ReviewFormProps & InjectedIntlProps> = (props) => {
    const {formError, verifiedPurchaserQueryParams} = props;
    const [errors, setErrors] = useState({});
    const getGlobalFormErrorMessage = useCallback((): GlobalFormErrorMessage => {
        if (formError && formError.ErrorCode === FormErrorCodes.DUPLICATE_SUBMISSION) {
            return {
                title: props.intl.formatMessage(messages.duplicateSubmissionTitle),
                detail: props.intl.formatMessage(messages.duplicateSubmissionDetails),
            };
        }

        return {
            title: props.intl.formatMessage(messages.defaultErrorMessageTitle),
            detail: props.intl.formatMessage(messages.defaultErrorMessageDetails),
        };
    }, [formError, props.intl.formatMessage]);

    const getInlineErrorMessage = useCallback(
        (defaultMessage: FormattedMessage.MessageDescriptor, fieldName: string) => {
            if (errors[fieldName]) {
                const errorCode = errors[fieldName].ErrorCode;
                const errorType = FormErrorCodes[errorCode];
                let errorMessage;

                if (errorType && errorType === FormErrorCodes.CONTAIN_PROFANITY) {
                    errorMessage = props.intl.formatMessage(messages.fieldContainsProfanity);
                } else if (errorType && errorType === FormErrorCodes.EMOJI_NOT_SUPPORTED) {
                    errorMessage = props.intl.formatMessage(messages.fieldContainsEmoji);
                }

                return errorMessage || errorType; // in case new errors where introduced
            }

            return props.intl.formatMessage(defaultMessage);
        },
        [errors, props.intl.formatMessage],
    );

    const getHelpMessage = useCallback(
        (defaultMessage: FormattedMessage.MessageDescriptor, fieldName: string) => {
            return errors[fieldName] ? "" : props.intl.formatMessage(defaultMessage);
        },
        [errors, props.intl.formatMessage],
    );

    const resetValidation = useCallback(
        (fieldName: string) => {
            if (errors[fieldName]) {
                const {[fieldName]: dummy, ...rest} = errors;
                setErrors({...rest});
            }
        },
        [errors],
    );

    useEffect(() => {
        const hasInlineFormFieldsErrors = formError && formError.FormErrors && formError.FormErrors.length;
        if (hasInlineFormFieldsErrors) {
            const fieldsErrors = arrayToObject(formError.FormErrors) || {};
            setErrors(fieldsErrors);
        }
    }, [formError]);

    return (
        <div className={styles.formContainer}>
            {formError && formError.ErrorCode && (
                <MessageBox
                    messageIcon={IconType.Warning}
                    messageTitle={getGlobalFormErrorMessage().title}
                    messageDetails={getGlobalFormErrorMessage().detail}
                />
            )}
            <Form onSubmit={props.onFormSubmit}>
                <div className={styles.ratingContainer}>
                    <ReviewStarRate
                        className={styles.starRateElement}
                        extraAttrs={{"data-automation": "review-star-rating"}}
                        name="rating"
                        errorMsg={props.intl.formatMessage(messages.reviewRatingErrorMessage)}
                        validators={[required]}
                    />
                </div>
                <h3 className={styles.reviewDetailsTitle}>
                    <FormattedMessage {...messages.reviewDetailsTitle} />
                </h3>
                <p className={styles.reviewDetailsDescription}>
                    <FormattedMessage {...messages.reviewDetailsDescription} />
                </p>
                <div className={styles.formAndGuidelinesWrapper}>
                    <div className={styles.formWrapper}>
                        <Input
                            onFocus={() => resetValidation("title")}
                            error={!!errors.title}
                            className={styles.input}
                            extraAttrs={{"data-automation": "review-title"}}
                            name="title"
                            maxLength={50}
                            label={props.intl.formatMessage(messages.reviewTitleLabel)}
                            helperTxt={getHelpMessage(messages.reviewTitleHelpText, "title")}
                            errorMsg={getInlineErrorMessage(messages.reviewTitleErrorMessage, "title")}
                            validators={[required]}
                        />
                        <ReviewGuidelinesCta {...props} />
                        <TextArea
                            handleSyncChange={() => resetValidation("comment")}
                            error={!!errors.comment}
                            extraAttrs={{"data-automation": "review-details"}}
                            name="comment"
                            label={props.intl.formatMessage(messages.reviewLabel)}
                            rows={10}
                            maxLength={10000}
                            errorMsg={getInlineErrorMessage(messages.reviewErrorMessage, "comment")}
                            validators={[required]}></TextArea>

                        <Input
                            onFocus={() => resetValidation("reviewerName")}
                            error={!!errors.reviewerName}
                            className={styles.input}
                            extraAttrs={{"data-automation": "reviewer-nickname"}}
                            name="reviewerName"
                            maxLength={25}
                            label={props.intl.formatMessage(messages.nickname)}
                            validators={[required]}
                            helperTxt={getHelpMessage(messages.nicknameHelpText, "reviewerName")}
                            errorMsg={getInlineErrorMessage(messages.nicknameErrorMessage, "reviewerName")}
                        />

                        {props.bazaarVoiceEnabled && (
                            <Input
                                onFocus={() => resetValidation("email")}
                                error={!!errors.email}
                                className={classIf(
                                    styles.input,
                                    verifiedPurchaserQueryParams.email === "",
                                    classname([styles.input, styles.disabled]),
                                )}
                                extraAttrs={{"data-automation": "reviewer-email"}}
                                name="email"
                                maxLength={255}
                                label={props.intl.formatMessage(messages.email)}
                                validators={[required, isValidEmailFormat]}
                                helperTxt={getHelpMessage(messages.emailHelpText, "email")}
                                errorMsg={getInlineErrorMessage(messages.emailErrorMessage, "email")}
                                value={verifiedPurchaserQueryParams.email}
                            />
                        )}

                        <Input
                            onFocus={() => resetValidation("reviewerLocation")}
                            error={!!errors.reviewerLocation}
                            className={styles.input}
                            extraAttrs={{"data-automation": "reviewer-location"}}
                            name="reviewerLocation"
                            maxLength={50}
                            label={props.intl.formatMessage(messages.location)}
                            validators={[required]}
                            helperTxt={getHelpMessage(messages.locationHelpText, "reviewerLocation")}
                            errorMsg={getInlineErrorMessage(messages.locationErrorMessage, "reviewerLocation")}
                        />

                        <h3 className={styles.friendRecommendation}>
                            <FormattedMessage {...messages.friendRecommendation} />
                        </h3>
                        <RadioGroup
                            name={"isRecommended"}
                            validators={[required]}
                            errorMsg={props.intl.formatMessage(messages.friendRecommendationErrorMessage)}>
                            <RadioButton
                                label={props.intl.formatMessage(messages.friendRecommendationOptionYes)}
                                selectedValue={"true"}
                                className={styles.friendRecommendationOptions}
                            />
                            <RadioButton
                                label={props.intl.formatMessage(messages.friendRecommendationOptionNo)}
                                selectedValue={"false"}
                                className={styles.friendRecommendationOptions}
                            />
                        </RadioGroup>

                        <FeatureToggle
                            flag={FEATURE_TOGGLES.keyConsiderationEnabled}
                            defaultComponent={null}
                            featureComponent={
                                <KeyConsiderations value={0} easeOfUse={0} quality={0} isEditable={true} />
                            }
                        />

                        {props.bazaarVoiceEnabled && (
                            <Input type="hidden" name="deviceFingerprint" extraAttrs={{id: "ioBlackBox"}} />
                        )}

                        {props.bazaarVoiceEnabled && (
                            <Input type="hidden" name="token" value={verifiedPurchaserQueryParams.token} />
                        )}

                        {props.campaignId && <Input type="hidden" name="campaignId" value={props.campaignId} />}

                        <Button
                            className={styles.formSubmit}
                            type="submit"
                            appearance="secondary"
                            extraAttrs={{"data-automation": "reviewer-submit"}}
                            shouldFitContainer={props.screenSize.lessThan.small}>
                            <FormattedMessage {...messages.submit} />
                        </Button>
                    </div>
                    {props.screenSize.greaterThan.small && <ReviewGuidelines />}
                </div>
                <ReviewTermsAndConditions {...props.env} />
            </Form>
        </div>
    );
};

const ReviewGuidelinesCta = (props: ReviewFormProps & InjectedIntlProps) => {
    const chevronDirection = props.showGuidelines ? "up" : "down";

    return (
        <div className={styles.reviewGuidelinesWrapper}>
            <Link
                className={styles.reviewGuidelinesCta}
                ariaLabel={props.intl.formatMessage(messages.reviewGuidelinesLabel)}
                extraAttrs={{"data-automation": "reviewGuidelinesLabel"}}
                chevronType={chevronDirection}
                onClick={(e) => props.onGuidelinesClick(e)}>
                <FormattedMessage {...messages.reviewGuidelinesLabel} />
            </Link>
            {props.showGuidelines && <ReviewGuidelines />}
        </div>
    );
};

const ReviewTermsAndConditions = (env: CmsEnvironment) => {
    const config = getHelpTopicsId(env);

    return (
        <div className={styles.terms}>
            <FormattedMessage
                {...messages.termsAndConditions}
                values={{
                    conditionsOfUseLink: (
                        <Link to={EventTypes.help as Key} params={config.conditionsOfUse}>
                            <FormattedMessage {...messages.conditionsOfUseLink} />
                        </Link>
                    ),
                }}
            />
        </div>
    );
};

const ReviewFormWithIntl = injectIntl(ReviewForm);

export {
    ReviewFormWithIntl,
    ReviewForm,
    ReviewGuidelinesCta,
    ReviewTermsAndConditions,
    VerifiedPurchaserQueryParams,
    defaultVerifiedPurchaserQueryParams,
};
