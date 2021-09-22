import * as React from "react";

import {ProductContent} from "models";
import {IconType} from "components/MessageBox";

import TargettedContent from "../TargettedContent";
import {getTargettedContent} from "../../../ProductDetailPage/utils/";

interface SaleMessageBoxProps {
    targettedContent: ProductContent;
}

const SaleMessageBox: React.FC<SaleMessageBoxProps> = ({targettedContent}) => {
    const items = getTargettedContent(targettedContent, "sale_message", "sale-message");
    return items.map((content, index: number) => (
        <div key={index} data-automation="product-state-sale-message">
            <TargettedContent icon={IconType.TimeOutCart} content={content} />
        </div>
    ));
};

export default SaleMessageBox;
