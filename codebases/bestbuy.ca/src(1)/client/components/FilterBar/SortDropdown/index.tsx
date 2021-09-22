import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import messages from "../translations/messages";
import * as styles from "./style.css";
import {ProductSort} from "models";
import Dropdown from "components/Dropdown";

interface Props {
    handleChange: (targetValue: ProductSort, payload: any) => any;
    handleSortClick?: () => any;
    sort: ProductSort;
}

export const SortDropdown: React.SFC<Props & InjectedIntlProps> = ({intl, sort, handleChange, handleSortClick}) => {
    const onChangeRequest = (targetValue) => {
        const payload = {
            label: "Sort By",
            link: targetValue,
        };
        handleChange(targetValue, payload);
    };

    const title = intl.formatMessage(messages.sortAriaLabel);

    return (
        <div
            role="button"
            className={styles.container}
            onClick={handleSortClick}
            data-automation="products-sort-dropdown">
            <div className={styles.sortLabel} data-automation="products-sort-dropdown-label">
                {title}
            </div>
            <Dropdown
                className={styles.productSortDropdown}
                optionSelected={sort}
                dropdownTitle={title}
                options={getOptions(intl)}
                onOptionChange={onChangeRequest}
            />
        </div>
    );
};

const getOptions = (intl) => [
    {
        value: ProductSort.bestMatch,
        label: intl.formatMessage(messages.bestMatch),
    },
    {
        value: ProductSort.priceLowToHigh,
        label: intl.formatMessage(messages.priceLowToHigh),
    },
    {
        value: ProductSort.priceHighToLow,
        label: intl.formatMessage(messages.priceHighToLow),
    },
    {
        value: ProductSort.highestRated,
        label: intl.formatMessage(messages.highestRated),
    },
];

export default injectIntl<Props>(SortDropdown);
