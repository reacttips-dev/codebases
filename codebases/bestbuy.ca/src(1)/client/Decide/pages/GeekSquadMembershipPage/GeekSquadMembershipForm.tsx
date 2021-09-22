import * as React from "react";
import {InjectedIntlProps} from "react-intl";
import {
    Form,
    Button,
    isValidEmailFormat,
    numbersOnly,
    canadaPostAddressComplete,
    hasAddressChars,
    hasNameChars,
    hasPostalCodeChars,
    Input,
    maxLength,
    minLength,
    ProvinceSelector,
    required,
    Select,
} from "@bbyca/bbyca-components";

import {WebToLeadSignUpProvider} from "../../providers";

import * as styles from "./styles.css";
import messages from "./translations/messages";
import {
    industries,
    AddressInputNames,
    canadaPostFieldsMap,
    mapToSalesforceFields,
    hydrateSalesforceFieldMap,
} from "./utils/helper";

export interface AddressInput {
    addressLine1: string;
    city: string;
    countryCode: string;
    postalCode: string;
    regionCode: string;
}

interface Props {
    salesforceOrgId: string;
    salesforceURL: string;
    leadDetailsId: string;
    promoCodeId: string;
    gsbmLeadRecordTypeId: string;
    setShowConfirmation: (value: boolean) => any;
}

const GeekSquadMembershipForm = (props: Props & InjectedIntlProps) => {
    const {
        intl,
        salesforceURL,
        salesforceOrgId,
        leadDetailsId,
        promoCodeId,
        gsbmLeadRecordTypeId,
        setShowConfirmation,
    } = props;
    const [addressInput, setAddressInput] = React.useState({
        addressLine1: "",
        city: "",
        countryCode: "CA",
        postalCode: "",
        regionCode: "",
    });
    React.useEffect(() => {
        canadaPostAddressComplete.setFields(canadaPostFieldsMap, canadaPostAddressFound, {
            countries: {codesList: "CAN, USA"},
            culture: intl.locale,
            key: "DB98-WX79-XM39-ZX59",
        });
    }, []);
    const canadaPostAddressFound = (address: AddressInput) => {
        setAddressInput({
            ...addressInput,
            ...address,
        });
    };
    const handleAddressInputUpdate = (addressInputFieldName: string) => {
        return (name: string, value: string) => {
            const newAddressInput = addressInput;
            newAddressInput[addressInputFieldName] = value;
            setAddressInput({...newAddressInput});
        };
    };
    const onSubmit = async (type: string, event: any, data: any) => {
        event.preventDefault();
        setShowConfirmation(true);
        const payload = Object.keys(data).reduce(
            (acc, attr) =>
                mapToSalesforceFields(data, acc, attr, hydrateSalesforceFieldMap(leadDetailsId, promoCodeId)),
            {},
        );
        const webToLeadSignUpProvider = new WebToLeadSignUpProvider(salesforceURL);
        await webToLeadSignUpProvider.postSignUp(payload);
        window.scrollTo(0, 0);
    };
    return (
        <>
            <h1 className={styles.title}>{intl.formatMessage(messages.geekSquadMembershipTitle)}</h1>
            <p>{intl.formatMessage(messages.geekSquadMembershipDescription)}</p>
            <p className={styles.helperText}>{intl.formatMessage(messages.geekSquadMembershipFormRequiredText)}</p>
            <p className={styles.subHeader}>{intl.formatMessage(messages.geekSquadMembershipFormBusinessSubHeader)}</p>
            <Form onSubmit={onSubmit}>
                <Input
                    label={intl.formatMessage(messages.geekSquadMembershipFormFieldBusinessName)}
                    maxLength={40}
                    name="company"
                    extraAttrs={{"data-automation": "company"}}
                    validators={[required]}
                    errorMsg={intl.formatMessage(messages.geekSquadMembershipFormFieldBusinessNameErrorMessage)}
                />
                <Input
                    label={intl.formatMessage(messages.geekSquadMembershipFormFieldStreet)}
                    asyncValidators={[hasAddressChars]}
                    extraAttrs={{"data-automation": "addressInput"}}
                    maxLength={70}
                    name={AddressInputNames.addressLine1}
                    handleSyncChange={handleAddressInputUpdate(AddressInputNames.addressLine1)}
                    type="text"
                    value={addressInput.addressLine1}
                />
                <div className={styles.flexContainer}>
                    <Input
                        label={intl.formatMessage(messages.geekSquadMembershipFormFieldCity)}
                        asyncValidators={[hasNameChars]}
                        className={`${styles.mediumInput} ${styles.inputMargin}`}
                        extraAttrs={{"data-automation": "cityInput"}}
                        maxLength={30}
                        handleSyncChange={handleAddressInputUpdate(AddressInputNames.city)}
                        name={AddressInputNames.city}
                        type="text"
                        value={addressInput.city}
                    />
                    <ProvinceSelector
                        label={intl.formatMessage(messages.geekSquadMembershipFormFieldProvince)}
                        className={`${styles.smallInput} ${styles.inputMargin}`}
                        controllable={true}
                        extraAttrs={{"data-automation": "regionCodeSelector"}}
                        locale={intl.locale === "fr-CA" ? "fr-CA" : "en-CA"}
                        name={AddressInputNames.regionCode}
                        handleSyncChange={handleAddressInputUpdate(AddressInputNames.regionCode)}
                        value={addressInput.regionCode}
                    />
                    <Input
                        label={intl.formatMessage(messages.geekSquadMembershipFormFieldPostalCode)}
                        asyncValidators={[maxLength(6), hasPostalCodeChars]}
                        className={`${styles.uppercase} ${styles.smallInput} ${styles.inputMargin}`}
                        extraAttrs={{"data-automation": "postalCodeInput"}}
                        formatter={"*** ***"}
                        maxLength={7}
                        name={AddressInputNames.postalCode}
                        handleSyncChange={handleAddressInputUpdate(AddressInputNames.postalCode)}
                        value={addressInput.postalCode}
                    />
                </div>
                {/* tslint:disable:react-a11y-role-has-required-aria-props */}
                <Select
                    label={intl.formatMessage(messages.geekSquadMembershipFormFieldCountry)}
                    className={`${styles.clear} ${styles.disabledDropdownArrow}`}
                    controllable={true}
                    extraAttrs={{"data-automation": "countryInput", ...{disabled: "disabled"}}}
                    name={AddressInputNames.countryCode}
                    value={addressInput.countryCode}
                    helperTxt={intl.formatMessage(messages.geekSquadMembershipFormFieldCountryHelperText)}>
                    <option value="CA">Canada</option>
                </Select>
                {/* tslint:enable:react-a11y-role-has-required-aria-props */}
                <Input
                    label={intl.formatMessage(messages.geekSquadMembershipFormFieldEmployees)}
                    maxLength={40}
                    extraAttrs={{"data-automation": "employees"}}
                    name="employees"
                    type="number"
                />
                {/* tslint:disable:react-a11y-role-has-required-aria-props */}
                <Select
                    label={intl.formatMessage(messages.geekSquadMembershipFormFieldIndustry)}
                    name={"industry"}
                    extraAttrs={{"data-automation": "industry"}}>
                    {industries.map((industry, i) => (
                        <option value={industry.value} key={industry.id}>
                            {intl.formatMessage(messages[`geekSquadMembershipFormFieldOptions${industry.id}`])}
                        </option>
                    ))}
                </Select>
                {/* tslint:enable:react-a11y-role-has-required-aria-props */}
                <p className={styles.subHeader}>
                    {intl.formatMessage(messages.geekSquadMembershipFormContactSubHeader)}
                </p>
                <Input
                    label={intl.formatMessage(messages.geekSquadMembershipFormFieldContactName)}
                    maxLength={40}
                    name="name"
                    validators={[required]}
                    extraAttrs={{"data-automation": "name"}}
                    errorMsg={intl.formatMessage(messages.geekSquadMembershipFormFieldContactNameErrorMessage)}
                />
                <Input
                    label={intl.formatMessage(messages.geekSquadMembershipFormFieldPhoneNumber)}
                    formatter={"(###) ### ####"}
                    maxLength={40}
                    name="phone"
                    extraAttrs={{"data-automation": "phone"}}
                    validators={[required, numbersOnly, minLength(10)]}
                    errorMsg={intl.formatMessage(messages.geekSquadMembershipFormFieldPhoneErrorMessage)}
                />
                <Input
                    label={intl.formatMessage(messages.geekSquadMembershipFormFieldEmail)}
                    maxLength={80}
                    name="email"
                    extraAttrs={{"data-automation": "email"}}
                    validators={[required, isValidEmailFormat]}
                    errorMsg={intl.formatMessage(messages.geekSquadMembershipFormFieldEmailErrorMessage)}
                />
                {/* tslint:disable:react-a11y-role-has-required-aria-props */}
                <Select
                    label={intl.formatMessage(messages.geekSquadMembershipFormFieldTime)}
                    name="time"
                    extraAttrs={{"data-automation": "time"}}>
                    {/* tslint:disable:react-a11y-role-has-required-aria-props */}
                    <option value="">{intl.formatMessage(messages.geekSquadMembershipFormFieldOptionSelect)}</option>
                    <option value="Call Morning (8:00 am to 12:00pm PST)">
                        {intl.formatMessage(messages.geekSquadMembershipFormFieldOptionMorning)}
                    </option>
                    <option value="Call Afternoon (12:00 pm to 4:30pm PST)">
                        {intl.formatMessage(messages.geekSquadMembershipFormFieldOptionNoon)}
                    </option>
                    <option value="Call Anytime">
                        {intl.formatMessage(messages.geekSquadMembershipFormFieldOptionAnytime)}
                    </option>
                </Select>
                {/* tslint:enable:react-a11y-role-has-required-aria-props */}
                <p className={styles.subHeader}>
                    {intl.formatMessage(messages.geekSquadMembershipFormSubtitleCampaign)}
                </p>
                <Input
                    label={intl.formatMessage(messages.geekSquadMembershipFormFieldPromo)}
                    extraAttrs={{"data-automation": "promo_code"}}
                    maxLength={40}
                    name="promo_code"
                />
                <Input type={"hidden"} className={styles.hidden} name="last_name" />
                <Input type={"hidden"} className={styles.hidden} name="recordType" value={gsbmLeadRecordTypeId} />
                <Input
                    type={"hidden"}
                    className={styles.hidden}
                    name="oid"
                    value={salesforceOrgId}
                    validators={[required]}
                />
                <Input type={"hidden"} className={styles.hidden} name="source" value="Web" />
                <Button className={styles.submitButton} appearance="secondary" type={"submit"}>
                    {intl.formatMessage(messages.geekSquadMembershipFormFieldSubmit)}
                </Button>
            </Form>
        </>
    );
};

export default GeekSquadMembershipForm;
