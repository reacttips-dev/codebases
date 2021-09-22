import * as React from "react";
import {Loader, Link} from "@bbyca/bbyca-components";
import {FormattedPlural, FormattedMessage} from "react-intl";

import {Warranty} from "models";
import {Price} from "components/Price";
import {classname} from "utils/classname";
import {trackEngagement} from "utils/analytics/gspInCart";

import messages from "./translations/messages";
import {OptionBoxText} from "../OptionBox";
import * as styles from "./styles.css";
import WarrantyOptionsLoader from "./WarrantyOptionsLoader";

type SelectedOption = Warranty | null;

export interface WarrantyOptionsProps {
    initialOption: SelectedOption;
    isLoading?: boolean;
    onOptionSelected?: (parentSku: string, selectedOption: SelectedOption) => void;
    options: Warranty[];
    parentSku: string;
    className?: string;
    warrantyTermsAndConditionUrl: string;
    trackEngagements: boolean;
    disabled?: boolean;
}

const MONTHS_IN_YEAR = 12;

const sortByMonth = (a: Warranty, b: Warranty) => a.termMonths - b.termMonths;

export const WarrantyOptions: React.FC<WarrantyOptionsProps> = ({
    className = "",
    initialOption,
    isLoading = false,
    onOptionSelected,
    options = [],
    parentSku,
    warrantyTermsAndConditionUrl,
    trackEngagements = false,
    disabled,
}) => {
    const [selectedOption, setSelectedOption] = React.useState<SelectedOption>(initialOption);

    const handleWarrantySelect = (warranty: SelectedOption) => {
        if (!disabled) {
            if (warranty && trackEngagements) {
                trackEngagement(warranty);
            }
            setSelectedOption(warranty);
            if (onOptionSelected && typeof onOptionSelected === "function") {
                onOptionSelected(parentSku, warranty);
            }
        }
    };

    return (
        <Loader loading={isLoading} loadingDisplay={<WarrantyOptionsLoader />}>
            <div
                className={classname([styles.warrantyBoxContainer, className])}
                data-automation="geeksquad-warranty-plans-container">
                <OptionBoxText
                    dataAutomation="geeksquad-warranty-no-plans"
                    isSelected={!selectedOption}
                    onClick={() => (selectedOption ? handleWarrantySelect(null) : null)}
                    price={null}
                    disabled={disabled}
                    text={<FormattedMessage {...messages.noPlan} />}
                />
                {options.sort(sortByMonth).map((warranty) => {
                    const termYear = warranty.termMonths / MONTHS_IN_YEAR;
                    const isSelected = (selectedOption && selectedOption.sku === warranty.sku) || false;
                    return (
                        <OptionBoxText
                            key={warranty.sku}
                            disabled={disabled}
                            onClick={() => (isSelected ? null : handleWarrantySelect(warranty))}
                            isSelected={isSelected}
                            dataAutomation={`geeksquad-warranty-${warranty.termMonths}`}
                            text={
                                <FormattedPlural
                                    one={<FormattedMessage {...messages.year} values={{year: termYear}} />}
                                    other={<FormattedMessage {...messages.years} values={{year: termYear}} />}
                                    value={termYear}
                                />
                            }
                            price={<Price value={warranty.regularPrice} />}
                        />
                    );
                })}
                {selectedOption && (
                    <p className={styles.warrantyConditionsText} data-automation="warranty-options-legal-copy">
                        <FormattedMessage
                            {...messages.warrantyConditionsLink}
                            values={{
                                link: (
                                    <Link href={warrantyTermsAndConditionUrl}>
                                        <FormattedMessage {...messages.warrantyConditionsLinkText} />
                                    </Link>
                                ),
                            }}
                        />
                    </p>
                )}
            </div>
        </Loader>
    );
};

WarrantyOptions.displayName = "WarrantyOptions";

export default WarrantyOptions;
