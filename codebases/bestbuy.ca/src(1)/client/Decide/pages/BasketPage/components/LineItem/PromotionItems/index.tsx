import {FormattedMessage} from "react-intl";
import * as React from "react";
import {LoadingSkeleton} from "@bbyca/bbyca-components";

import {classname} from "utils/classname";
import {Promotion} from "models/Basket";

import messages from "./translations/messages";
import * as styles from "./styles.css";

export interface PromotionItemsProps {
    className?: string;
    promotions: Promotion[];
    loading: boolean | undefined;
    totalSavings: string;
}

export const PromotionItems: React.FC<PromotionItemsProps> = ({
    className = "",
    promotions = [],
    loading,
    totalSavings,
}) => {
    return promotions && promotions.length > 0 ? (
        <table className={classname([className, styles.promoItemsTable])}>
            <tbody className={styles.promoItemsTableBody}>
                {promotions.map((promotion) => promotion.amount !== 0 && (
                    <tr key={promotion.id}>
                        <td colSpan={2} className={styles.itemLevelDiscountDescription}>
                            {promotion.description}
                        </td>
                    </tr>
                ))}
                <tr>
                    <td className={classname([styles.promoTotalText, styles.leftCol])}>
                        <FormattedMessage {...messages.PromotionalDiscount} />:
                    </td>
                    <td className={classname([styles.promoTotalValue, styles.rightCol])}>
                        {loading ? <LoadingSkeleton.Price /> : `-${totalSavings}`}
                    </td>
                </tr>
            </tbody>
        </table>
    ) : null;
};

export default PromotionItems;
