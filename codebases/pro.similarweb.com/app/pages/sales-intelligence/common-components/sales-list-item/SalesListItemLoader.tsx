import React from "react";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";

const LIST_ITEM_HEIGHT = 64;
const SalesListItemLoader: React.FC = () => {
    return <PixelPlaceholderLoader width="100%" height={LIST_ITEM_HEIGHT} />;
};

export default React.memo(SalesListItemLoader);
