import * as React from "react";
import {connect, MapStateToProps} from "react-redux";
import {InjectedIntlProps} from "react-intl";
import State from "store";

import {Form, isValidEmailFormat, numbersOnly, Input, TextArea, minLength, required} from "@bbyca/bbyca-components";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";

import {ErrorActionCreators} from "actions";
import {WebappError} from "errors";
import {ActivationTypes, PickupStore, StoreLocationById, StoreStatuses} from "models";

import {WebToLeadSignUpProvider} from "../../../../providers";
import * as styles from "./styles.css";
import messages from "./translations/messages";
import {mapToSalesforceFields, hydrateSalesforceFieldMap} from "../../utils/helper";
import {Stores, StoreSelector} from "..";
import {Controllers} from "../Controllers";
import LocateByPostalCodeAndGeoLocation from "Decide/components/LocateByPostalCodeAndGeoLocation";
import {
    getUserShippingLocationCity,
    getUserShippingLocationNearbyStores,
    getUserShippingLocationRegionCode,
} from "store/selectors";

interface CellPhoneInquiryFormData {
    firstName: string;
    phone: number;
    email: string;
}

export interface CellPhonePlanFormStateProps {
    activationType: ActivationTypes;
    salesforceOrgId: string;
    mobileLeadRecordTypeId: string;
    previousUrl?: string;
    geoLocatedRegion: string;
    salesforceUrl: string;
    storeId: string;
    inquiryTypeId: string;
    language: Language;
    storeLocations: StoreLocationById;
    onSubmit: (data: CellPhoneInquiryFormData) => void;
    errorActions: ErrorActionCreators;
    handleCancelClick: () => void;
}

export interface StateProps {
    nearbyStores: PickupStore[];
    province: string;
    city: string;
}

export type CustomerDetailsFormProps = CellPhonePlanFormStateProps & InjectedIntlProps & StateProps;

export const CustomerDetailsForm: React.FC<CustomerDetailsFormProps> = ({
    activationType,
    intl,
    salesforceOrgId,
    mobileLeadRecordTypeId,
    previousUrl = "",
    storeLocations,
    onSubmit,
    salesforceUrl,
    storeId,
    inquiryTypeId,
    language,
    errorActions,
    nearbyStores,
    province,
    city,
    handleCancelClick = () => {
        // default
    },
}) => {
    const [filteredStoresByStatus, setFilteredStoresByStatus] = React.useState<Stores>([]);

    React.useEffect(() => {
        if (nearbyStores && storeLocations) {
            setFilteredStoresByStatus(filterStoresByStatus());
        }
    }, [nearbyStores, storeLocations]);

    const filterStoresByStatus = (): Stores => {
        const stores: Stores = [];
        nearbyStores.forEach((store) => {
            const {locationId, distance} = store;
            const storeLocation = storeLocations[locationId];
            if (locationId !== "0" && storeLocation && storeLocation.status !== StoreStatuses.closed) {
                stores.push({
                    storeNo: locationId,
                    storeName: distance
                        ? `${storeLocation.storeName} ${intl.formatMessage(messages.distanceToAStore, {distance})}`
                        : storeLocation.storeName,
                    province: storeLocation.province,
                    city: storeLocation.city || "",
                    status: storeLocation.status,
                });
            }
        });
        return stores.slice(0, 10);
    };

    const onPostalCodeSubmit = (isPostalCodeValid: boolean) => {
        if (!isPostalCodeValid) {
            setFilteredStoresByStatus([]);
        }
    };

    const handleSubmit = async (type: string, event: any, data: any) => {
        event.preventDefault();
        // Finalized formdata after appending store location name to details field. (Store : Vancouver, Additionnal Information : xxxxxxxx

        try {
            adobeLaunch.pushEventToDataLayer({
                event: "mobile-activation-submit",
            });
            const formData = {
                ...data,
                city: {
                    error: false,
                    errorMsg: "",
                    value: city,
                },
                province: {
                    error: false,
                    errorMsg: "",
                    value: province,
                },
                details: {
                    ...data.details,
                    value: `Additional Information: ${data.details.value}, Store: ${
                        storeLocations[data.storeLocation.value].storeName
                    }`,
                },
            };
            const salesforceMap = hydrateSalesforceFieldMap(storeId, inquiryTypeId);
            const payload = Object.keys(salesforceMap).reduce(
                (acc, attr) => mapToSalesforceFields(formData, acc, attr, salesforceMap),
                {},
            );
            window.scrollTo(0, 0);
            onSubmit({firstName: data.firstName.value, phone: data.phone.value, email: data.email.value});
            const webToLeadSignUpProvider = new WebToLeadSignUpProvider(salesforceUrl);
            await webToLeadSignUpProvider.postSignUp(payload);
        } catch {
            errorActions.error(new WebappError("Failed to create salesforce lead"));
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Input
                label={intl.formatMessage(messages.firstName)}
                maxLength={40}
                className={styles.mediumInput}
                name="firstName"
                extraAttrs={{"data-automation": "first_name"}}
                validators={[required]}
                errorMsg={intl.formatMessage(messages.firstNameErrorMessage)}
            />
            <Input
                label={intl.formatMessage(messages.lastName)}
                maxLength={80}
                className={styles.mediumInput}
                name="lastName"
                extraAttrs={{"data-automation": "last_name"}}
                validators={[required]}
                errorMsg={intl.formatMessage(messages.lastNameErrorMessage)}
            />
            <Input
                label={intl.formatMessage(messages.email)}
                maxLength={80}
                className={styles.mediumInput}
                name="email"
                type="email"
                extraAttrs={{"data-automation": "email"}}
                validators={[required, isValidEmailFormat]}
                helperTxt={intl.formatMessage(messages.emailHelper)}
                errorMsg={intl.formatMessage(messages.emailErrorMessage)}
            />
            <Input
                label={intl.formatMessage(messages.phoneNumber)}
                maxLength={40}
                className={styles.mediumInput}
                name="phone"
                type="tel"
                formatter={"(###) ### ####"}
                extraAttrs={{"data-automation": "phone"}}
                helperTxt={intl.formatMessage(messages.phoneNumberHelper)}
                validators={[required, numbersOnly, minLength(10)]}
                errorMsg={intl.formatMessage(messages.phoneErrorMessage)}
            />
            <LocateByPostalCodeAndGeoLocation
                ctaText={intl.formatMessage(messages.searchButton)}
                placeholder={intl.formatMessage(messages.postalCodePlaceholder)}
                className={styles.mediumInput}
                label={intl.formatMessage(messages.label)}
                helperText={intl.formatMessage(messages.helperText)}
                errorMessage={intl.formatMessage(messages.postalCodeErrorMessage)}
                noNearbyStoreMessage={intl.formatMessage(messages.noNearbyStoreMessage)}
                onSubmit={onPostalCodeSubmit}
            />
            <StoreSelector stores={filteredStoresByStatus} intl={intl} />
            <Input
                type="hidden"
                value={activationType}
                className={styles.hiddenFields}
                name="inquiryType"
                extraAttrs={{"data-automation": "inquiryType"}}
            />
            <TextArea
                label={intl.formatMessage(messages.details)}
                name="details"
                className={styles.mediumInput}
                extraAttrs={{"data-automation": "details"}}
            />
            <div className={styles.hiddenFields}>
                <Input
                    type={"hidden"}
                    className={styles.hidden}
                    name="language"
                    value={language === "fr" ? "French" : "English"}
                />
                <Input type={"hidden"} className={styles.hidden} name="recordType" value={mobileLeadRecordTypeId} />
                <Input type={"hidden"} className={styles.hidden} name="oid" value={salesforceOrgId} />
                <Input type={"hidden"} className={styles.hidden} name="website" value={previousUrl} />
                <Input type={"hidden"} className={styles.hidden} name="source" value="Web" />
            </div>
            <Controllers
                continueButton={{
                    dataAutomation: "submit-mobile-activation-request",
                    label: intl.formatMessage(messages.submitButton),
                }}
                cancelButton={{
                    handler: handleCancelClick,
                    dataAutomation: "cancel-activation-form",
                    label: intl.formatMessage(messages.cancelLink),
                }}
            />
        </Form>
    );
};

const mapStateToProps: MapStateToProps<StateProps, {}, State> = (state) => {
    return {
        nearbyStores: getUserShippingLocationNearbyStores(state),
        city: getUserShippingLocationCity(state),
        province: getUserShippingLocationRegionCode(state),
    };
};

export default connect(mapStateToProps, {})(CustomerDetailsForm);
