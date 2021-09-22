import {Recommendations} from "../../models";

export const initialRecommendationsState: Partial<Recommendations> = {
    recentlyViewed: [],
};

export const recommendations = (state = initialRecommendationsState, action) => {
    switch (action.type) {
        default:
            return state;
    }
};

export default recommendations;
