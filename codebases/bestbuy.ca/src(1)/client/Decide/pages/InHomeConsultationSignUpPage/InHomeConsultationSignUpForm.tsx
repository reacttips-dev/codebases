import * as React from "react";
import {InjectedIntlProps} from "react-intl";
import {
    Form,
    Input,
    Button,
    TextArea,
    Checkbox,
    Select,
    isValidEmailFormat,
    numbersOnly,
    required,
    minLength,
} from "@bbyca/bbyca-components";

import {WebToLeadSignUpProvider} from "../../providers";
import {mapToSalesforceValues} from "./utils/helper";
import * as styles from "./styles.css";
import messages from "./translations/messages";

interface Props {
    salesforceOrgId: string;
    salesforceURL: string;
    privacyPolicyURL: string;
    termsAndConditionsURL: string;
    setShowConfirmation: (value: boolean) => any;
}

const InHomeConsultationSignUpForm = (props: Props & InjectedIntlProps) => {
    const {intl, salesforceURL, salesforceOrgId, privacyPolicyURL, termsAndConditionsURL, setShowConfirmation} = props;
    const onSubmit = async (type: string, event: any, data: any) => {
        event.preventDefault();
        const payload = Object.keys(data).reduce((acc, attr) => mapToSalesforceValues(data, acc, attr), {});
        const webToLeadSignUpProvider = new WebToLeadSignUpProvider(salesforceURL);
        await webToLeadSignUpProvider.postSignUp(payload);
        window.scrollTo(0, 0);
        setShowConfirmation(true);
    };
    return (
        <>
            <h1 className={styles.title}>{intl.formatMessage(messages.inHomeConsultationSignUpTitle)}</h1>
            <p>{intl.formatMessage(messages.inHomeConsultationSignUpDescription)}</p>
            <Form onSubmit={onSubmit}>
                <Input
                    type={"hidden"}
                    className={styles.hidden}
                    name="oid"
                    value={salesforceOrgId}
                    validators={[required]}
                    errorMsg={"You've not accepted the terms and conditions"}
                />
                <Input
                    label={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldFirstName)}
                    maxLength={40}
                    name="first_name"
                    extraAttrs={{"data-automation": "first_name"}}
                    validators={[required]}
                    errorMsg={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldFirstNameErrorMessage)}
                />
                <Input
                    label={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldLastName)}
                    maxLength={80}
                    name="last_name"
                    extraAttrs={{"data-automation": "last_name"}}
                    validators={[required]}
                    errorMsg={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldLastNameErrorMessage)}
                />
                <Input
                    label={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldEmail)}
                    maxLength={80}
                    name="email"
                    extraAttrs={{"data-automation": "email"}}
                    validators={[required, isValidEmailFormat]}
                    errorMsg={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldEmailErrorMessage)}
                />
                <Input
                    label={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldPhoneNumber)}
                    maxLength={40}
                    name="phone"
                    formatter={"(###) ### ####"}
                    extraAttrs={{"data-automation": "phone"}}
                    validators={[required, numbersOnly, minLength(10)]}
                    errorMsg={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldPhoneErrorMessage)}
                />
                {/* tslint:disable:react-a11y-role-has-required-aria-props */}
                <Select
                    label={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldLanguage)}
                    name={"00Nf400000KIAcg"}
                    extraAttrs={{"data-automation": "locale"}}
                    validators={[required]}
                    errorMsg={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldLanguageErrorMessage)}>
                    <option value="">
                        {intl.formatMessage(messages.inHomeConsultationSignUpFormFieldOptionsDefault)}
                    </option>
                    <option value="English">
                        {intl.formatMessage(messages.inHomeConsultationSignUpFormFieldOptionsEn)}
                    </option>
                    <option value="French">
                        {intl.formatMessage(messages.inHomeConsultationSignUpFormFieldOptionsFr)}
                    </option>
                </Select>
                {/* tslint:enable:react-a11y-role-has-required-aria-props */}
                <TextArea
                    label={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldDetails)}
                    name="00Nf400000KIAcf"
                    extraAttrs={{"data-automation": "details"}}
                />
                <Checkbox
                    label={intl.formatMessage(messages.inHomeConsultationSignUpFormFieldConsent)}
                    name={"emailOptOut"}
                    extraAttrs={{"data-automation": "consent"}}
                />
                <Input type={"hidden"} className={styles.hidden} name="lead_source" value="Web" />
                <Input type={"hidden"} name="00Nf400000KIAcP" className={styles.hidden} value="checked" />
                <Input type={"hidden"} className={styles.hidden} name="recordType" value="012f40000019JgS" />
                <Button className={styles.submitButton} appearance="secondary" type={"submit"}>
                    {intl.formatMessage(messages.inHomeConsultationSignUpFormFieldSubmit)}
                </Button>
                <p className={styles.footerText}>
                    {intl.formatMessage(messages.inHomeConsultationSignUpFormFieldContinue)}
                    <a href={termsAndConditionsURL} target="_blank">
                        {intl.formatMessage(messages.inHomeConsultationSignUpFormFieldTerms)}
                    </a>
                    {intl.formatMessage(messages.inHomeConsultationSignUpFormFieldSeperator)}
                    <a href={privacyPolicyURL} target="_blank">
                        {intl.formatMessage(messages.inHomeConsultationSignUpFormFieldPrivacy)}
                    </a>
                    .
                </p>
            </Form>
        </>
    );
};
export default InHomeConsultationSignUpForm;
