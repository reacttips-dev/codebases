import * as React from "react";
import {FormattedMessage} from "react-intl";
import {LoadingSkeleton} from "@bbyca/bbyca-components";

import {classname} from "utils/classname";

import * as styles from "./styles.css";
import messages from "./translations/messages";

export interface SubTotalProps {
    className?: string;
    loading: boolean | undefined;
    subTotal: string;
}

export const SubTotal: React.FC<SubTotalProps> = (props: SubTotalProps) => {
    const {className = "", loading, subTotal} = props;
    return (
        <table className={classname([styles.subTotalTable, className])}>
            <tbody>
                <tr>
                    <td className={classname([styles.leftCol, styles.subTotalText])}>
                        <strong>
                            <FormattedMessage {...messages.ItemSubtotal} />
                        </strong>
                    </td>
                    <td className={classname([styles.rightCol, styles.subTotalText])}>
                        <strong>
                            <span>{loading ? <LoadingSkeleton.Price /> : subTotal}</span>
                        </strong>
                    </td>
                </tr>
            </tbody>
        </table>
    );
};

export default SubTotal;
