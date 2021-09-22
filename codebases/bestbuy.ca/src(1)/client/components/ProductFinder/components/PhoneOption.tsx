import * as React from "react";
import { RadioButton, RadioGroup, Loader, LoadingSkeleton } from "@bbyca/bbyca-components";
import { injectIntl } from "react-intl";
import * as styles from "../styles.css";

export interface OptionItem {
    label: string | JSX.Element;
    selectedValue: string;
    className?: string;
}

export interface Props {
    className?: string;
    dataAutomation?: string;
    loading: boolean;
    groupName: string;
    optionName: string | JSX.Element;
    options?: OptionItem[];
    onChange: (name: string, val: string) => void;
    selectedValue: string;
    selectedValueLabel?: string | JSX.Element;
}

export const PhoneOptionSkeleton = () => (
    <>
        <LoadingSkeleton.Title width={120} />
        <LoadingSkeleton.Banner className={styles.skeletonLoader} />
    </>
);

const PhoneOption = ({
    className,
    groupName,
    onChange,
    optionName,
    options,
    selectedValue,
    selectedValueLabel,
    dataAutomation,
    loading,
}: Props) => (
    <Loader
        loading={loading}
        loadingDisplay={<PhoneOptionSkeleton />}
    >
        <div className={className} data-automation={dataAutomation}>
            <p className={styles.optionTitle}>
                <span className={styles.optionName}>{optionName}</span>
                <span className={styles.optionValue}>{selectedValueLabel}</span>
            </p>
            <RadioGroup name={groupName} hideCheckmarks={true} onChange={onChange} value={selectedValue}>
                {options && options.map((option) => (
                    <RadioButton key={option.selectedValue} {...option} />
                ))}
            </RadioGroup>
        </div>
    </Loader>
);

export default injectIntl(PhoneOption);
