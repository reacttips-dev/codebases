import * as React from "react";
import {DeliveryIcon, Link, ChevronRight} from "@bbyca/bbyca-components";
import {buildLinkProps} from "@bbyca/apex-components";

import {SectionMessageData, MessageItem} from "models";

import * as styles from "./style.css";

interface Props {
    targettedContent: any;
    linkClassName?: string;
}

const DeliveryNotice: React.FC<Props> = ({targettedContent, linkClassName = ""}) => {
    const deliveryNoticeContent = () => {
        const deliveryInfo = "delivery_notice";
        const specialDeliveryContent = getAvailabilityContent(deliveryInfo, "delivery-info");
        return specialDeliveryContent && specialDeliveryContent.items[0];
    };

    const getAvailabilityContent = (context: string, messageName: string) => {
        const {contexts, sections} = targettedContent;

        if (contexts && contexts[context]) {
            return contexts[context];
        } else if (sections && sections.length) {
            return (
                sections.find((section: SectionMessageData) =>
                    section.items.find((item: MessageItem) => item.messageType === messageName),
                ) || null
            );
        } else {
            return null;
        }
    };

    const deliveryNoticeMessageItem = deliveryNoticeContent();

    if (deliveryNoticeMessageItem) {
        const hasEventLink = deliveryNoticeMessageItem.event && deliveryNoticeMessageItem.event.eventType;
        return (
            <div className={styles.deliveryNotice}>
                <div className={styles.deliveryNoticeTitleWrap}>
                    <DeliveryIcon color="black" opacity={"1"} className={`${styles.iconStyle} ${styles.icon}`} />
                    <div className={styles.deliveryNoticeMessageTitle}>{deliveryNoticeMessageItem.messageTitle}</div>
                </div>
                <p className={styles.deliveryNoticeMessageBody}>{deliveryNoticeMessageItem.messageBody}</p>
                {hasEventLink && (
                    <div
                        data-automation="product-availability-special-delivery"
                        className={`${styles.deliveryNoticeLink} ${linkClassName}`}>
                        <Link {...buildLinkProps(deliveryNoticeMessageItem.event)}>
                            {deliveryNoticeMessageItem.ctaText}
                            <ChevronRight className={`${styles.icon} ${styles.rightArrowIcon}`} />
                        </Link>
                    </div>
                )}
            </div>
        );
    } else {
        return null;
    }
};

export default DeliveryNotice;
