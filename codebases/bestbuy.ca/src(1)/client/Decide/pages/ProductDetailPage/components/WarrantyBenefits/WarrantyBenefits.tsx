import * as React from "react";
import {tracker} from "@bbyca/ecomm-utilities";
import {FormattedMessage} from "react-intl";
import {GeekSquadOrange, Link, Modal, Button} from "@bbyca/bbyca-components";

import {classname} from "utils/classname";
import {WarrantyType, BenefitsMessage} from "models";

import WarrantyBenefitsMessage from "../../../../components/WarrantyBenefitsMessage";
import * as styles from "./style.css";
import messages from "./translations/messages";

interface Props {
    className?: string;
    warrantyType: string;
    warrantyBenefitsMessage?: BenefitsMessage;
    onToggleBenefitsDialog: () => void;
    warrantyTermsAndConditionUrl: string;
}

WarrantyBenefitsMessage.displayName = "InjectIntl(WarrantyBenefitsMessage)";

const WarrantyBenefits: React.FC<Props> = ({
    warrantyType,
    warrantyBenefitsMessage,
    onToggleBenefitsDialog,
    className,
    warrantyTermsAndConditionUrl,
}) => {
    const [isDialogOpen, toggleDialog] = React.useState(false);
    const headerMessage = messages[warrantyType === WarrantyType.PRP ? "grp" : "gsp"];
    const handleWarrantyBenefitsDialogClick = () => {
        toggleDialog(!isDialogOpen);
        tracker.dispatchEvent({
            action: "Click",
            category: "Warranty",
            label: "Learn More",
        });
    };

    const closeDialog = () => toggleDialog(false);
    const getWarrantyBenefitsMessageData = () => {
        if (warrantyBenefitsMessage?.body) {
            return {
                // do not call for title here. CMS returns non-customer facing data in that field.
                body: warrantyBenefitsMessage.body,
            };
        }
    };

    return (
        <div className={classname([styles.warrantyMessaging, className])}>
            <GeekSquadOrange className={styles.geekSquadLogo} viewBox="-4 0 90 49" />
            <p className={styles.planWrapper}>
                <FormattedMessage {...headerMessage} />
            </p>
            <span className={styles.benefitsWrapper}>
                <Link
                    onClick={() => {
                        handleWarrantyBenefitsDialogClick();
                        onToggleBenefitsDialog();
                    }}
                    chevronType={"right"}
                    targetSelf={true}
                    data-automation="geeksquad-benefits-link">
                    <FormattedMessage {...messages.benefits} />
                </Link>
            </span>
            <Modal visible={isDialogOpen} onClose={closeDialog}>
                <div className={styles.messageContainer}>
                    <WarrantyBenefitsMessage
                        warrantyTermsAndConditionUrl={warrantyTermsAndConditionUrl}
                        warrantyType={warrantyType as WarrantyType}
                        content={getWarrantyBenefitsMessageData()}
                    />
                </div>
                <Button
                    className={classname([styles.button, styles.continueShopping])}
                    onClick={closeDialog}
                    data-automation="warranty-benefits-dialog-button">
                    <FormattedMessage {...messages.okay} />
                </Button>
            </Modal>
        </div>
    );
};

export default WarrantyBenefits;
