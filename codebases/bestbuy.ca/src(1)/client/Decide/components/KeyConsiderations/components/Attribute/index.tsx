import * as React from "react";
import * as styles from "./style.css";
import {InjectedIntlProps, injectIntl} from "react-intl";
import messages from "./translations/messages";
import {RangeSelection, RangeSelectionProps, FormItemProps} from "@bbyca/bbyca-components";
import {classname, classIf} from "utils/classname";

export type AttributeProps = Pick<
    RangeSelectionProps,
    "name" | "preselectedTile" | "title" | "isSelectable" | "clearButtonLabel" | "rangeLabels" | "ariaLabels"
> &
    "InjectedIntlProps";

export const withKeyConsideration = (Component: React.ComponentType<RangeSelectionProps & FormItemProps>) => ({
    name = "",
    preselectedTile,
    title,
    intl,
    isSelectable,
    clearButtonLabel,
    rangeLabels,
    ariaLabels,
}: AttributeProps & InjectedIntlProps): React.ReactElement<RangeSelectionProps & FormItemProps> | null => {
    if (!isSelectable && !preselectedTile) {
        return null;
    }

    const totalTiles = 5;

    const getAttributeRating = (selectedTile: number): string => {
        switch (selectedTile) {
            case 1:
                return intl.formatMessage(messages.poor);
            case 2:
                return intl.formatMessage(messages.fair);
            case 3:
                return intl.formatMessage(messages.average);
            case 4:
                return intl.formatMessage(messages.good);
            case 5:
                return intl.formatMessage(messages.excellent);
            default:
                return "";
        }
    };

    return (
        <Component
            totalTiles={totalTiles}
            rangeLabels={rangeLabels}
            name={name}
            preselectedTile={preselectedTile}
            title={title}
            getSelectedRatingLabel={getAttributeRating}
            ariaLabels={ariaLabels}
            isSelectable={isSelectable}
            clearButtonLabel={clearButtonLabel}
            className={classname([styles.attributeSection, classIf(styles.rangeSelection, !!isSelectable)])}
        />
    );
};

export default injectIntl(withKeyConsideration(RangeSelection));
