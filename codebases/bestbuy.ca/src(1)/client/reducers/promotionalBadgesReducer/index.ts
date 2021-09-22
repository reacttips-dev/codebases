import {PromotionalBadges} from "../../models";

export const initialPromotionalBadges: PromotionalBadges = {};

export const promotionalBadges = (state = initialPromotionalBadges, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default promotionalBadges;
