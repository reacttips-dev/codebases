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
    Select,
} from "@bbyca/bbyca-components";
import {InjectedIntlProps} from "react-intl";
import {WebToLeadSignUpProvider} from "../../providers";
import {mapToSalesforceFields} from "../GeekSquadMembershipPage/utils/helper";
import * as styles from "./style.css";
import messages from "./translations/messages";

interface Props {
    salesforceOrgId: string;
    salesforceUrl: string;
    leadDetailsId: string;
    methodOfContactId: string;
    helpOptionId: string;
    localeId: string;
    bbyHealthLeadRecordTypeId: string;
    setShowConfirmation: (value: boolean) => any;
}

const HealthContactForm = (props: Props & InjectedIntlProps) => {
    const {
        intl,
        salesforceUrl,
        salesforceOrgId,
        leadDetailsId,
        methodOfContactId,
        helpOptionId,
        localeId,
        bbyHealthLeadRecordTypeId,
        setShowConfirmation,
    } = props;
    const onSubmit = async (type: string, event: any, data: any) => {
        event.preventDefault();
        const hydratedSalesforceFieldMap = {
            email: "email",
            phone: "phone",
            details: "description",
            preference: methodOfContactId,
            reason: helpOptionId,
            locale: localeId,
            recordType: "recordType",
            oid: "oid",
            name: "first_name",
            last_name: "last_name",
            source: "lead_source",
            time: leadDetailsId,
        };
        const payload = Object.keys(data).reduce(
            (acc, attr) => mapToSalesforceFields(data, acc, attr, hydratedSalesforceFieldMap),
            {},
        );
        const webToLeadSignUpProvider = new WebToLeadSignUpProvider(salesforceUrl);
        await webToLeadSignUpProvider.postSignUp(payload);
        setShowConfirmation(true);
        window.scrollTo(0, 0);
    };
    return (
        <Form onSubmit={onSubmit}>
            <Input
                label={intl.formatMessage(messages.healthContactName)}
                maxLength={40}
                name="name"
                validators={[required, hasNameChars, (val: any): boolean => val.replace(/\s/g, "").length]}
                className={styles.mediumInput}
                extraAttrs={{"data-automation": "name"}}
                errorMsg={intl.formatMessage(messages.healthContactNameErrorMessage)}
            />
            <Input
                label={intl.formatMessage(messages.healthContactEmail)}
                maxLength={80}
                name="email"
                className={styles.mediumInput}
                extraAttrs={{"data-automation": "email"}}
                validators={[required, isValidEmailFormat]}
                errorMsg={intl.formatMessage(messages.healthContactEmailErrorMessage)}
            />
            <Input
                label={intl.formatMessage(messages.healthContactPhone)}
                formatter={"(###) ### ####"}
                maxLength={40}
                name="phone"
                className={styles.mediumInput}
                extraAttrs={{"data-automation": "phone"}}
                validators={[required, numbersOnly, minLength(10)]}
                errorMsg={intl.formatMessage(messages.healthContactPhoneErrorMessage)}
            />
            {/* tslint:disable:react-a11y-role-has-required-aria-props */}
            <Select
                label={intl.formatMessage(messages.healthContactMethodOfContact)}
                name="preference"
                extraAttrs={{"data-automation": "preference"}}
                className={styles.mediumInput}
                validators={[required]}
                errorMsg={intl.formatMessage(messages.healthContactMethodOfContactErrorMessage)}>
                <option value="">{intl.formatMessage(messages.healthContactFieldOptionSelect)}</option>
                <option value="Email">{intl.formatMessage(messages.healthContactMethodOfContactOptionEmail)}</option>
                <option value="Phone call">
                    {intl.formatMessage(messages.healthContactMethodOfContactOptionPhone)}
                </option>
            </Select>
            <Select
                label={intl.formatMessage(messages.healthContactReason)}
                name="reason"
                extraAttrs={{"data-automation": "reason"}}
                validators={[required]}
                className={styles.mediumInput}
                errorMsg={intl.formatMessage(messages.healthContactMethodOfContactErrorMessage)}>
                <option value="">{intl.formatMessage(messages.healthContactFieldOptionSelect)}</option>
                <option value="Assured Living">{intl.formatMessage(messages.healthContactReasonOptionAssured)}</option>
                <option value="Best Buy Health General Inquiries">
                    {intl.formatMessage(messages.healthContactReasonOptionGeneral)}
                </option>
                <option value="Digital Citizen">{intl.formatMessage(messages.healthContactReasonOptionDigital)}</option>
                <option value="Expand Your Reach">
                    {intl.formatMessage(messages.healthContactReasonOptionExpand)}
                </option>
            </Select>
            <Select
                label={intl.formatMessage(messages.healthContactTimeToCall)}
                name="time"
                className={styles.mediumInput}
                extraAttrs={{"data-automation": "time"}}>
                <option value="">{intl.formatMessage(messages.healthContactFieldOptionSelect)}</option>
                <option value="Call Morning (8:00 am to 12:00pm PST)">
                    {intl.formatMessage(messages.healthContactTimeOptionMorning)}
                </option>
                <option value="Call Afternoon (12:00 pm to 4:30pm PST)">
                    {intl.formatMessage(messages.healthContactTimeOptionNoon)}
                </option>
                <option value="Call Anytime">{intl.formatMessage(messages.healthContactTimeOptionAnytime)}</option>
            </Select>
            {/* tslint:enable:react-a11y-role-has-required-aria-props */}
            <TextArea
                label={intl.formatMessage(messages.healthContactDetails)}
                name="details"
                className={styles.mediumInput}
                extraAttrs={{"data-automation": "details"}}
            />
            <Button
                extraAttrs={{"data-automation": "submit"}}
                className={styles.submitButton}
                appearance="secondary"
                type="submit">
                {intl.formatMessage(messages.healthContactFormFieldSubmit)}
            </Button>
            <Input
                type={"hidden"}
                className={styles.hidden}
                name="locale"
                value={intl.locale === "en-CA" ? "English" : "French"}
            />
            <Input type={"hidden"} className={styles.hidden} name="last_name" />
            <Input type={"hidden"} className={styles.hidden} name="recordType" value={bbyHealthLeadRecordTypeId} />
            <Input type={"hidden"} className={styles.hidden} name="source" value="Web" />
            <Input
                type={"hidden"}
                className={styles.hidden}
                name="oid"
                value={salesforceOrgId}
                validators={[required]}
            />
        </Form>
    );
};

export default HealthContactForm;
