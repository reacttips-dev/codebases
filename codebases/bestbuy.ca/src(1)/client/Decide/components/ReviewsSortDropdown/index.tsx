import * as React from "react";
import {InjectedIntlProps, injectIntl, InjectedIntl} from "react-intl";

import {ReviewSortOptions} from "models";
import {classname} from "utils/classname";
import Dropdown from "components/Dropdown";

import messages from "./translations/messages";
import * as styles from "./style.css";

interface Props {
    handleChange: (targetOption: ReviewSortOptions) => void;
    sort: ReviewSortOptions;
    className?: string;
}

export const ReviewsSortDropdown: React.FC<Props & InjectedIntlProps> = ({intl, sort, handleChange, className}) => {
    return (
        <div className={classname([styles.reviewsSortContainer, className])} data-automation="reviews-sort-dropdown">
            <p className={styles.sortLabel} data-automation="reviews-sort-dropdown-label">
                {intl.formatMessage(messages.sortAriaLabel)}
            </p>
            <Dropdown
                className={styles.reviewsSortDropdown}
                optionSelected={sort}
                options={getSortOptions(intl, messages)}
                dropdownTitle={intl.formatMessage(messages.sortAriaLabel)}
                onOptionChange={handleChange}
            />
        </div>
    );
};

const getSortOptions = (intl: InjectedIntl, optionLabel: {[key: string]: {id: string}}) => [
    {
        value: ReviewSortOptions.relevancy,
        label: intl.formatMessage(optionLabel.mostRelevant),
    },
    {
        value: ReviewSortOptions.helpfulness,
        label: intl.formatMessage(optionLabel.helpfulness),
    },
    {
        value: ReviewSortOptions.newest,
        label: intl.formatMessage(optionLabel.newest),
    },
    {
        value: ReviewSortOptions.oldest,
        label: intl.formatMessage(optionLabel.oldest),
    },
    {
        value: ReviewSortOptions.highestRating,
        label: intl.formatMessage(optionLabel.highestRating),
    },
    {
        value: ReviewSortOptions.lowestRating,
        label: intl.formatMessage(optionLabel.lowestRating),
    },
];

export default injectIntl<Props>(ReviewsSortDropdown);
