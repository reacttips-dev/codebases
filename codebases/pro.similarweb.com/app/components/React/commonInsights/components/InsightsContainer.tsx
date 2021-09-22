import { Carousel } from "components/Carousel/src/Carousel";
import { swSettings } from "common/services/swSettings";
import {
    NT_DISPLAY_MARKETING_PRODUCT_KEY,
    NT_AFFILIATE_MARKETING_PRODUCT_KEY,
} from "constants/ntProductKeys";

export const InsightsContainer = ({ children }) => {
    const productKey = swSettings.components.Home.resources.ProductKey;
    const hasInsightClaim = ![
        NT_DISPLAY_MARKETING_PRODUCT_KEY,
        NT_AFFILIATE_MARKETING_PRODUCT_KEY,
    ].includes(productKey);
    return hasInsightClaim && <Carousel margin={16}>{children}</Carousel>;
};
