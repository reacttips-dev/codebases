import * as React from "react";
import {FormattedMessage} from "react-intl";
import PhoneOption from "./PhoneOption";
import * as styles from "../styles.css";
import messages from "../translations/messages";
import PlanSelectorButtonLabel from "./PlanSelectorButtonLabel";

interface Props {
    includePlan: boolean;
    loading: boolean;
    onChange: () => void;
    hasUnlockedOption: boolean;
}

const enum SelectedValue {
    YES = "yes",
    NO = "no",
}

const PlanSelector = ({includePlan, loading, onChange, hasUnlockedOption}: Props) => {
    const options = [
        {
            label: (
                <PlanSelectorButtonLabel
                    messageId={messages.carrierButton.id}
                    subMessageId={messages.carrierButtonSubText.id}
                />
            ),
            selectedValue: SelectedValue.YES,
        },
    ];
    if (hasUnlockedOption) {
        options.push({
            label: (
                <PlanSelectorButtonLabel
                    messageId={messages.unlockedButton.id}
                    subMessageId={messages.unlockedButtonSubText.id}
                />
            ),
            selectedValue: SelectedValue.NO,
        });
    }
    return (
        <>
            <PhoneOption
                loading={loading}
                dataAutomation="phone-finder-include-carrier"
                className={styles.toggle}
                groupName={"phone-include-carrier"}
                optionName={
                    <span className={styles.addPlanText}>
                        <FormattedMessage {...messages.addPlanQuestion} />
                    </span>
                }
                options={options}
                onChange={onChange}
                selectedValue={includePlan ? SelectedValue.YES : SelectedValue.NO}
            />
            <p className={`${styles.legalText} ${styles.planSelectionMessage}`}>
                <FormattedMessage id={messages.planSelectionMessage.id} />
            </p>
        </>
    );
};

export default PlanSelector;
