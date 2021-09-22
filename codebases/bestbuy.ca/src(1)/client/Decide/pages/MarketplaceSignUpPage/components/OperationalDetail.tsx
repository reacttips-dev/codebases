import * as React from "react";
import {useState} from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {RadioButton, RadioGroup, TextArea, required, Select} from "@bbyca/bbyca-components";
import messages from "./translations/messages";
import * as styles from "./styles.css";
import {RadioButtonOption, CountryOption} from "../FormOptions";
import * as Constants from "../constants";

export const OperationalDetail: React.FC<InjectedIntlProps> = ({intl}) => {
    const [otherMarketplace, setOtherMarketplace] = useState("");

    return (
        <>
            <h3 className={styles.sectionTitle} data-automation="operational-detail-header">
                <FormattedMessage {...messages.operationalDetailTitle} />
            </h3>
            <div data-automation="otherMarketplace-radio-div">
                <RadioGroup
                    className={styles.radioGroup}
                    validators={[required]}
                    errorMsg={intl.formatMessage({...messages.operationalDetailRadioButtonErrorMessage})}
                    value={otherMarketplace}
                    onChange={(name, val) => setOtherMarketplace(val)}
                    name={Constants.OTHER_MARKETPLACE}>
                    <label data-automation="otherMarketplace-label" className={styles.label}>
                        <FormattedMessage {...messages.operationalDetailCurrentlySelling} />
                    </label>
                    <RadioButton
                        extraAttrs={{"data-automation": "otherMarketplace-yes-radioButton"}}
                        selectedValue={RadioButtonOption.yes}
                        label={intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsYes})}
                    />
                    <RadioButton
                        extraAttrs={{"data-automation": "otherMarketplace-no-radioButton"}}
                        selectedValue={RadioButtonOption.no}
                        label={intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsNo})}
                    />
                </RadioGroup>

                {otherMarketplace === RadioButtonOption.yes && (
                    <div className={styles.otherMarketplaceUrls} data-automation="otherMarketplace-urls-div">
                        <TextArea
                            validators={[required]}
                            label={intl.formatMessage({...messages.operationalDetailPublicMPUrls})}
                            extraAttrs={{"data-automation": "otherMarketplace-urls-input"}}
                            helperTxt={intl.formatMessage({...messages.operationalDetailPublicMPUrlsHelperText})}
                            errorMsg={intl.formatMessage({...messages.operationalDetailPublicMPUrlsErrorMessage})}
                            name={Constants.OTHER_MARKETPLACE_URLS}
                        />
                    </div>
                )}
            </div>

            <div data-automation="pricingSupport-radio-div">
                <RadioGroup
                    className={styles.radioGroup}
                    validators={[required]}
                    errorMsg={intl.formatMessage({...messages.operationalDetailRadioButtonErrorMessage})}
                    extraAttrs={{"data-automation": "pricingSupport-radioGroup"}}
                    value=""
                    name={Constants.PRICING_SUPPORT}>
                    <label data-automation="pricingSupport-label" className={styles.label}>
                        <FormattedMessage {...messages.operationalDetailPricingSupport} />
                    </label>
                    <RadioButton
                        extraAttrs={{"data-automation": "pricingSupport-yes-radioButton"}}
                        selectedValue={RadioButtonOption.yes}
                        label={intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsYes})}
                    />
                    <RadioButton
                        extraAttrs={{"data-automation": "pricingSupport-no-radioButton"}}
                        selectedValue={RadioButtonOption.no}
                        label={intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsNo})}
                    />
                </RadioGroup>
            </div>

            <Select
                className={styles.halfinput}
                errorMsg={intl.formatMessage({...messages.marketplaceSignUpFormCountryErr})}
                name={Constants.SHIPPING_WAREHOUSE_COUNTRY}
                extraAttrs={{"data-automation": "shipping-select"}}
                validators={[required]}
                label={intl.formatMessage({...messages.operationalDetailShippingWarehouse})}>
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

            <div data-automation="returns-radio-div">
                <RadioGroup
                    className={styles.radioGroup}
                    validators={[required]}
                    errorMsg={intl.formatMessage({...messages.operationalDetailRadioButtonErrorMessage})}
                    value=""
                    name={Constants.RETURNS_ADDRESS}>
                    <label data-automation="returns-label" className={styles.label}>
                        <FormattedMessage {...messages.operationalDetailProductReturns} />
                    </label>
                    <RadioButton
                        extraAttrs={{"data-automation": "returns-yes-radioButton"}}
                        selectedValue={RadioButtonOption.yes}
                        label={intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsYes})}
                    />
                    <RadioButton
                        extraAttrs={{"data-automation": "returns-no-radioButton"}}
                        selectedValue={RadioButtonOption.no}
                        label={intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsNo})}
                    />
                </RadioGroup>
            </div>
        </>
    );
};

export default injectIntl(OperationalDetail);
