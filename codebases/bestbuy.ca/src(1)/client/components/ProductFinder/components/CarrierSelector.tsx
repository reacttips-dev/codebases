import * as React from "react";
import {InjectedIntlProps, injectIntl, FormattedMessage} from "react-intl";
import PhoneOption, {Props as PhoneOptionProps, OptionItem} from "./PhoneOption";
import messages from "../translations/messages";
import * as styles from "../styles.css";
import * as bellLogo from "../assets/bell.svg";
import * as telusLogo from "../assets/telus.svg";
import * as fidoLogo from "../assets/fido.svg";
import * as rogersLogo from "../assets/rogers.svg";
import * as koodoLogo from "../assets/koodo.svg";
import * as virginMobileLogo from "../assets/virgin-mobile.svg";
import * as sasktelLogo from "../assets/sasktel.svg";
import * as bellWhiteLogo from "../assets/bell-white.svg";
import * as telusWhiteLogo from "../assets/telus-white.svg";
import * as fidoWhiteLogo from "../assets/fido-white.svg";
import * as rogersWhiteLogo from "../assets/rogers-white.svg";
import * as koodoWhiteLogo from "../assets/koodo-white.svg";
import * as virginMobileWhiteLogo from "../assets/virgin-mobile-white.svg";
import * as sasktelWhiteLogo from "../assets/sasktel-white.svg";
import {ProductImagePlaceholder} from "../../SvgIcons";

/* tslint:disable interface-over-type-literal */
type LogoMapping = {[key: string]: typeof import("*.svg")};

const carrierWhiteLogoMapping: LogoMapping = {
    bell: bellWhiteLogo,
    telus: telusWhiteLogo,
    fido: fidoWhiteLogo,
    "virgin mobile": virginMobileWhiteLogo,
    rogers: rogersWhiteLogo,
    koodo: koodoWhiteLogo,
    sasktel: sasktelWhiteLogo,
};

const carrierLogoMapping: LogoMapping = {
    bell: bellLogo,
    telus: telusLogo,
    fido: fidoLogo,
    "virgin mobile": virginMobileLogo,
    rogers: rogersLogo,
    koodo: koodoLogo,
    sasktel: sasktelLogo,
};

const carrierSelectorPriority: {[key: string]: number} = {
    rogers: 2,
    telus: 3,
    bell: 1,
    fido: 5,
    koodo: 6,
    "virgin mobile": 4,
    sasktel: 7,
};

export const getCarrierName = (name: string) => name && name.toLowerCase();

export const sortCarriers = (left: OptionItem, right: OptionItem) => {
    try {
        return (
            carrierSelectorPriority[getCarrierName(left.selectedValue)] -
            carrierSelectorPriority[getCarrierName(right.selectedValue)]
        );
    } catch (error) {
        return 1;
    }
};

const toCarrierLogoIcon = (selectedValue: string) => (option: OptionItem) => {
    const carrier = getCarrierName(option.selectedValue);

    const imgSrc =
        selectedValue === option.selectedValue ? carrierWhiteLogoMapping[carrier] : carrierLogoMapping[carrier];

    const image = (imgSrc && <img src={imgSrc} alt={carrier} />) || (
        <ProductImagePlaceholder width="40px" height="20px" />
    );
    return {
        ...option,
        label: image,
        className: styles.carrierRadioButton,
    };
};

const isLockedPhone = (option: OptionItem) =>
    option.label && typeof option.label === "string" && option.label.toLowerCase().indexOf("unlocked") === -1;

interface CarrierSelectorProps {
    includePlan: boolean;
}

type Props = CarrierSelectorProps & PhoneOptionProps & InjectedIntlProps;

const CarrierSelector: React.FunctionComponent<Props> = ({
    options,
    includePlan,
    selectedValue,
    groupName,
    optionName,
    onChange,
    loading = false,
}) => {
    return (
        <>
            {includePlan && (
                <>
                    <PhoneOption
                        optionName={optionName}
                        groupName={groupName}
                        selectedValue={selectedValue}
                        loading={loading}
                        className={`${styles.toggle} ${styles.flexRadioGroup}`}
                        dataAutomation="carrier-selector"
                        options={
                            options &&
                            options
                                .filter(isLockedPhone)
                                .map(toCarrierLogoIcon(selectedValue))
                                .sort(sortCarriers)
                        }
                        onChange={(name, value) => {
                            onChange("", value);
                        }}
                    />
                    {!loading && (
                        <p className={styles.legalText}>
                            <FormattedMessage id={messages.colorsLegalText.id} />
                        </p>
                    )}
                </>
            )}
        </>
    );
};

export default injectIntl(CarrierSelector);
