import * as React from "react";
import * as styles from "./style.css";
import Link from "components/Link";
import {Button} from "@bbyca/bbyca-components";
import {sendReviewAnalytics} from "Decide/pages/ProductDetailPage/utils";
import {injectIntl, FormattedMessage} from "react-intl";
import messages from "./translations/messages";

export interface WriteReviewButtonProps {
    productSku: string;
    productBrandName: string;
    primaryParentCategoryId: string;
}

export const WriteReviewButton: React.FC<WriteReviewButtonProps> = ({
    productSku,
    productBrandName,
    primaryParentCategoryId,
}) => {
    const onWriteAReviewButtonClick = () => {
        sendReviewAnalytics(
            {
                sku: productSku,
                brandName: productBrandName,
                primaryParentCategoryId,
            },
            "write",
            "PdpWriteReviewReviewTab",
        );
    };
    Link.displayName = "Link";
    return (
        <Link
            className={styles.writeReviewButton}
            to={"createProductReview"}
            params={[productSku]}
            // Use rel="nofollow" to tell search engine to not follow this link
            extraAttrs={{rel: "nofollow"}}
            onClick={onWriteAReviewButtonClick}>
            <Button
                className={styles.innerButton}
                extraAttrs={{"data-automation": "writeReviewButton"}}
                appearance="tertiary"
                type="button"
                size={"regular"}>
                <FormattedMessage {...messages.writeReviewButton} />
            </Button>
        </Link>
    );
};

WriteReviewButton.displayName = "WriteReviewButton";

export default injectIntl(WriteReviewButton);
