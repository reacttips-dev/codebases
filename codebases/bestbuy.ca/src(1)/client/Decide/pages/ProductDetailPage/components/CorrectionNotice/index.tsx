import * as React from "react";

import {ProductContent} from "models";
import {IconType} from "components/MessageBox";

import TargettedContent from "../TargettedContent";
import {getTargettedContent} from "../../utils/";
import * as styles from "./style.css";

interface CorrectionNoticeProps {
    targettedContent: ProductContent;
}

const CorrectionNotice: React.FC<CorrectionNoticeProps> = ({targettedContent}) => {
    const items = getTargettedContent(targettedContent, "correction_notice", "correction-notice");
    return items.map((content, index: number) => (
        <div key={index} className={styles.correctionNoticeContainer} data-automation="product-state-correction-notice">
            <TargettedContent icon={IconType.Info} content={content} />
        </div>
    ));
};

export default CorrectionNotice;
