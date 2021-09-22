import * as React from "react";
import State from "store";
import {connect} from "react-redux";
import {PromotionalBadges} from "models";
import {Badge} from "@bbyca/bbyca-components";
import {classname} from "utils/classname";
import * as styles from "./style.css";

interface StateProps {
    promotionalBadges?: PromotionalBadges;
}

export interface BadgeProps extends StateProps {
    sku: string;
    locale?: Locale | Language;
    className?: string;
    display?: boolean;
}

export const BadgeWrapper = ({sku, promotionalBadges, className = "", display = false}: BadgeProps) => {
    let isValidBadge = Boolean(promotionalBadges && promotionalBadges[sku] && promotionalBadges[sku].text);

    if (isValidBadge && promotionalBadges && promotionalBadges[sku].applyConditions) {
        isValidBadge = display;
    }

    const badgeText = (isValidBadge && promotionalBadges![sku].text) || "";

    return isValidBadge ? <Badge className={classname([className, styles.badgeWrpDefault])} title={badgeText} /> : null;
};

const mapStateToProps = (state: State): StateProps => {
    return {
        promotionalBadges: state.promotionalBadges,
    };
};

export default connect(mapStateToProps)(BadgeWrapper);
