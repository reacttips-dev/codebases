import * as React from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {Input, Select, required} from "@bbyca/bbyca-components";
import messages from "./translations/messages";
import * as styles from "./styles.css";
import {CountryOption} from "../FormOptions";

export const CompanyInfo: React.FC<InjectedIntlProps> = ({intl}) => {
    return (
        <>
            <h3 className={styles.sectionTitle} data-automation="company-info-header">
                <FormattedMessage {...messages.marketplaceSignUpFormCompanyInformationTitle} />
            </h3>

            <Input
                className={styles.fullinput}
                validators={[required]}
                extraAttrs={{"data-automation": "companyName-input"}}
                errorMsg={intl.formatMessage({...messages.marketplaceSignUpFormCompanyNameErr})}
                label={intl.formatMessage({...messages.marketplaceSignUpFormFieldCompanyName})}
                maxLength={100}
                name="company"
            />

            <Input
                extraAttrs={{"data-automation": "companyWebsite-input"}}
                className={styles.fullinput}
                label={intl.formatMessage({...messages.marketplaceSignUpFormFieldCompanyWebsite})}
                maxLength={80}
                name="URL"
            />

            <Select
                className={styles.halfinput}
                errorMsg={intl.formatMessage({...messages.marketplaceSignUpFormCountryErr})}
                name="country"
                extraAttrs={{"data-automation": "country-select"}}
                validators={[required]}
                label={intl.formatMessage({...messages.marketplaceSignUpFormCountry})}>
                <FormattedMessage {...messages.marketplaceSignUpFormCountrySelect}>
                    {(msg) => (
                        <option value="" disabled>
                            {msg}
                        </option>
                    )}
                </FormattedMessage>
                <FormattedMessage {...messages.marketplaceSignUpFormCountryCanada}>
                    {(msg) => <option value={CountryOption.canada}>{msg}</option>}
                </FormattedMessage>
                <FormattedMessage {...messages.marketplaceSignUpFormCountryUsa}>
                    {(msg) => <option value={CountryOption.usa}>{msg}</option>}
                </FormattedMessage>
                <FormattedMessage {...messages.marketplaceSignUpFormCountryOther}>
                    {(msg) => <option value={CountryOption.other}>{msg}</option>}
                </FormattedMessage>
            </Select>

            <div className={styles.cityProvince}>
                <Input
                    className={styles.halfinput}
                    label={intl.formatMessage({...messages.marketplaceSignUpFormCity})}
                    maxLength={80}
                    extraAttrs={{"data-automation": "city-input"}}
                    name="city"
                />

                <Input
                    className={styles.halfinput}
                    label={intl.formatMessage({...messages.marketplaceSignUpFormProvince})}
                    maxLength={80}
                    extraAttrs={{"data-automation": "province-input"}}
                    name="state"
                />
            </div>
        </>
    );
};

export default injectIntl(CompanyInfo);
