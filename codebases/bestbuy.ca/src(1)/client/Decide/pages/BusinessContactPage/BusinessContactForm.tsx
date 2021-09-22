import * as React from "react";
import {
    Form,
    Button,
    isValidEmailFormat,
    numbersOnly,
    Input,
    TextArea,
    minLength,
    hasNameChars,
    required,
    RadioButton,
    RadioGroup
} from "@bbyca/bbyca-components";
import {InjectedIntlProps} from "react-intl";
import {WebToLeadSignUpProvider, WebToCaseSignUpProvider } from "../../providers";
import * as styles from "./style.css";
import messages from "./translations/messages";
import {
    mapToSalesforceFields,
    hydrateSalesforceFieldMapByType,
} from "./utils/helper";

interface Props {
    salesforceOrgId: string;
    leadDetailsId: string;
    methodOfContactId: string;
    localeId: string;
    bbyBusinessLeadRecordTypeId: string;
    bbyBusinessCaseRecordTypeId: string;
    webToLeadUrl: string;
    webToCaseUrl: string;
    webFirstNameId: string;
    webLastNameId: string;
    webLanguageId: string;
    caseReferenceNumberId: string;
    caseReferenceTypeId: string;
    setShowConfirmation: (value: boolean) => any;
}

const BusinessContactForm = (props: Props & InjectedIntlProps) => {
    const {
        intl,
        webToLeadUrl,
        webToCaseUrl,
        salesforceOrgId,
        leadDetailsId,
        methodOfContactId,
        localeId,
        webFirstNameId,
        webLastNameId,
        webLanguageId,
        bbyBusinessLeadRecordTypeId,
        bbyBusinessCaseRecordTypeId,
        caseReferenceNumberId,
        caseReferenceTypeId,
        setShowConfirmation,
    } = props;
    const [contactPreference, setContactPreference] = React.useState("");
    const [isExistingOrder, setIsExistingOrder] = React.useState(false);

    const onSubmit = async (type: string, event: any, data: any) => {
        event.preventDefault();
        const hydratedSalesforceFieldMap = hydrateSalesforceFieldMapByType({
            leadDetailsId,
            methodOfContactId,
            localeId,
            webFirstNameId,
            webLastNameId,
            webLanguageId,
            caseReferenceNumberId,
            caseReferenceTypeId }, isExistingOrder);
        const payload = Object.keys(data).reduce(
            (acc, attr) =>
                mapToSalesforceFields(data, acc, attr, hydratedSalesforceFieldMap),
            {},
        );
        if (isExistingOrder) {
            const webToCaseSignUpProvider = new WebToCaseSignUpProvider(webToCaseUrl);
            await webToCaseSignUpProvider.postSignUp(payload);
        } else {
            const webToLeadSignUpProvider = new WebToLeadSignUpProvider(webToLeadUrl);
            await webToLeadSignUpProvider.postSignUp(payload);
        }
        setShowConfirmation(true);
        window.scrollTo(0, 0);
    };

    const toggleContactPreference = (field: string, value: string) => setContactPreference(value);

    const toggleIsExistingOrder = (field: string, value: string) => setIsExistingOrder(value === "Existing Order");

    return (
        <Form onSubmit={onSubmit}>
            <div className={styles.flexContainer}>
                <Input
                    label={intl.formatMessage(messages.businessContactFirstName)}
                    maxLength={40}
                    name="firstName"
                    validators={[required, hasNameChars, (val: any): boolean => val.replace(/\s/g, "").length]}
                    className={`${styles.mediumInput} ${styles.inputMargin}`}
                    extraAttrs={{"data-automation": "firstName"}}
                    errorMsg={intl.formatMessage(messages.businessContactFirstNameError)}
                />
                <Input
                    label={intl.formatMessage(messages.businessContactLastName)}
                    maxLength={40}
                    name="lastName"
                    validators={[required, hasNameChars, (val: any): boolean => val.replace(/\s/g, "").length]}
                    className={styles.mediumInput}
                    extraAttrs={{"data-automation": "lastName"}}
                    errorMsg={intl.formatMessage(messages.businessContactLastNameError)}
                />
            </div>
            <Input
                label={intl.formatMessage(messages.businessContactCompany)}
                maxLength={40}
                name="company"
                validators={[required, hasNameChars, (val: any): boolean => val.replace(/\s/g, "").length]}
                className={styles.mediumInput}
                extraAttrs={{"data-automation": "company"}}
                helperTxt={intl.formatMessage(messages.businessContactCompanyHelperText)}
                errorMsg={intl.formatMessage(messages.businessContactCompanyError)}
            />
            <p className={styles.radioLabel}>{intl.formatMessage(messages.businessContactMethodOfContact)}</p>
            <RadioGroup
                name="preference"
                onChange={toggleContactPreference}
                className={contactPreference ? styles.noBottomPadding : ""}
                extraAttrs={{"data-automation": "preference"}}
                validators={[required]}
                errorMsg={intl.formatMessage(messages.methodOfContactError)}>
                <RadioButton
                    label={props.intl.formatMessage(messages.businessContactOptionEmail)}
                    selectedValue={"Email"}
                />
                <RadioButton
                    label={props.intl.formatMessage(messages.businessContactOptionPhone)}
                    selectedValue={"Phone call"}
                />
            </RadioGroup>
            { contactPreference === "Phone call" && <>
                <Input
                    label={intl.formatMessage(messages.businessContactPhone)}
                    formatter={"(###) ### ####"}
                    maxLength={40}
                    name="phone"
                    className={styles.mediumInput}
                    extraAttrs={{"data-automation": "phone"}}
                    validators={[required, numbersOnly, minLength(10)]}
                    errorMsg={intl.formatMessage(messages.businessContactPhoneError)}
                />
                <p className={styles.radioLabel}>{intl.formatMessage(messages.businessContactTime)}</p>
                <RadioGroup
                    name="contactTime"
                    extraAttrs={{"data-automation": "contactTime"}}>
                    <RadioButton
                        label={props.intl.formatMessage(messages.businessContactOptionMorning)}
                        selectedValue={"Morning (8am - 12pm ET)"}
                    />
                    <RadioButton
                        label={props.intl.formatMessage(messages.businessContactOptionNoon)}
                        selectedValue={"Afternoon (12pm - 4pm ET)"}
                    />
                    <RadioButton
                        label={props.intl.formatMessage(messages.businessContactOptionEvening)}
                        selectedValue={"Evening (4pm - 8pm ET)"}
                    />
                    <RadioButton
                        label={props.intl.formatMessage(messages.businessContactOptionAnytime)}
                        selectedValue={"Anytime"}
                    />
                </RadioGroup>
            </> }
            { contactPreference === "Email" && <Input
                label={intl.formatMessage(messages.businessContactEmail)}
                maxLength={80}
                name="email"
                className={styles.mediumInput}
                extraAttrs={{"data-automation": "email"}}
                validators={[required, isValidEmailFormat]}
                errorMsg={intl.formatMessage(messages.businessContactEmailError)}/>
            }
            <p className={styles.radioLabel}>{intl.formatMessage(messages.businessContactReason)}</p>
            <RadioGroup
                name="reason"
                onChange={toggleIsExistingOrder}
                extraAttrs={{"data-automation": "reason"}}
                className={isExistingOrder ? styles.noBottomPadding : ""}
                validators={[required]}
                errorMsg={intl.formatMessage(messages.businessContactReasonError)}>
                <RadioButton
                    label={props.intl.formatMessage(messages.businessContactOptionExisting)}
                    selectedValue={"Existing Order"}
                />
                <RadioButton
                    label={props.intl.formatMessage(messages.businessContactOptionGeneral)}
                    selectedValue={"General Inquiries"}
                />
            </RadioGroup>
            { isExistingOrder && <>
                <Input
                    label={intl.formatMessage(messages.businessContactReference)}
                    maxLength={80}
                    validators={[numbersOnly]}
                    name="caseRefNo"
                    className={styles.mediumInput}
                    extraAttrs={{"data-automation": "caseRefNo"}}
                    errorMsg={intl.formatMessage(messages.businessContactReferenceError)}
                />
                <p className={styles.radioLabel}>{intl.formatMessage(messages.businessContactCaseType)}</p>
                <RadioGroup
                    name="caseType"
                    extraAttrs={{"data-automation": "caseType"}}>
                    <RadioButton
                        label={props.intl.formatMessage(messages.businessContactOptionReturn)}
                        selectedValue={"Return"}
                    />
                    <RadioButton
                        label={props.intl.formatMessage(messages.businessContactOptionTracking)}
                        selectedValue={"Tracking"}
                    />
                    <RadioButton
                        label={props.intl.formatMessage(messages.businessContactOptionOther)}
                        selectedValue={"Other Issue"}
                    />
                </RadioGroup>
            </>
            }
            <TextArea
                label={intl.formatMessage(messages.businessContactDetails)}
                name="details"
                className={styles.mediumTextArea}
                extraAttrs={{"data-automation": "details"}}
            />
            <Button
                extraAttrs={{"data-automation": "submit"}}
                className={styles.submitButton}
                appearance="secondary"
                type="submit">
                {intl.formatMessage(messages.businessContactSubmit)}
            </Button>
            <Input
                type={"hidden"}
                className={styles.hidden}
                name="locale"
                value={intl.locale === "en-CA" ? "English" : "French"}
            />
            { isExistingOrder && <Input type={"hidden"} className={styles.hidden} name="caseRefType" value="Order Number" /> }
            <Input type={"hidden"} className={styles.hidden} name="recordType" value={ isExistingOrder ? bbyBusinessCaseRecordTypeId : bbyBusinessLeadRecordTypeId} />
            <Input type={"hidden"} className={styles.hidden} name="source" value="Web" />
            <Input type={"hidden"} className={styles.hidden} name="oid" value={salesforceOrgId} />
        </Form>
    );
};

export default BusinessContactForm;
