import * as React from "react";
import {GeekSquadOrange, LoadingSkeleton} from "@bbyca/bbyca-components";
import {FormattedMessage} from "react-intl";
import {formatPrice} from "@bbyca/ecomm-checkout-components";

import Link from "components/Link";
import {Warranty, BenefitsMessage, WarrantyType} from "models";
import {classname, classIf} from "utils/classname";
import {trackExpand} from "utils/analytics/gspInCart";

import WarrantyBenefitsMessage from "../WarrantyBenefitsMessage";
import WarrantyOptions from "../WarrantyOptions";
import ChildProductHeader from "../ChildProductHeader";
import * as styles from "./styles.css";
import messages from "./translations/messages";

export interface GspPlanProps {
    initialOption: Warranty | null;
    locale: Locale;
    onOptionSelected?: (parentSku: string, selectedOption: Warranty | null) => void;
    options: Warranty[];
    warrantyTermsAndConditionUrl: string;
    parentSku: string;
    fetchWarrantyBenefits: (sku: string | null) => Promise<BenefitsMessage|void>;
    benefitsMessage?: BenefitsMessage;
    isBenefitsTextOpen?: boolean;
    isGspLoading: boolean;
    trackEngagements: boolean;
    disableCtas: boolean;
    noWidthCap?: boolean;
}

export const GspPlan: React.FC<GspPlanProps> = ({
    parentSku,
    initialOption,
    options,
    onOptionSelected,
    warrantyTermsAndConditionUrl,
    locale,
    fetchWarrantyBenefits,
    benefitsMessage,
    isBenefitsTextOpen = false,
    isGspLoading = false,
    trackEngagements = false,
    disableCtas = false,
    noWidthCap = false,
}) => {
    const [isOpen, setIsOpen] = React.useState(isBenefitsTextOpen);
    const [hasOpened, setHasOpened] = React.useState(isBenefitsTextOpen);
    const [benefitsFetched, setBenefitsFetched] = React.useState(!!benefitsMessage);

    const getBenefitsData = () => {
        if (!benefitsMessage) {
            fetchWarrantyBenefits(parentSku)
                .then(() => setBenefitsFetched(true));
        }
        if (!isOpen && trackEngagements && !hasOpened) {
            trackExpand();
            setHasOpened(true);
        }
        setIsOpen(!isOpen);
    };
    React.useEffect(() => {
        if (isBenefitsTextOpen) {
            fetchWarrantyBenefits(parentSku)
                .then(() => setBenefitsFetched(true));
        }
    }, []);

    const warrantyType: unknown = options.find(
        (option) => [WarrantyType.PSP, WarrantyType.PRP]
                    .includes(option.type as WarrantyType)
                        && benefitsFetched
    )?.type;

    return (
        <div className={classname([styles.container, classIf(styles.blockCap, !noWidthCap)])}>
            <ChildProductHeader
                icon={<GeekSquadOrange />}
                header={<FormattedMessage {...messages.Title} />}
                subheader={<FormattedMessage {...messages.Subtitle} />}
                className={classname([styles.headerContainer, styles.cap])}
            />
            <section className={classname([styles.warrantyBenefitsContainer, styles.cap])}>
                <Link onClick={getBenefitsData} chevronType={isOpen ? "up" : "down"}>
                    <FormattedMessage {...messages.SeeBenefits} />
                </Link>
                {isOpen && (
                    benefitsFetched ? <WarrantyBenefitsMessage
                        content={{body: benefitsMessage?.body}}
                        warrantyType={warrantyType as WarrantyType}
                        className={styles.warrantyBenefits}
                        warrantyTermsAndConditionUrl={warrantyTermsAndConditionUrl}
                    /> : (<div style={{marginTop: "10px"}}>
                        <LoadingSkeleton.Line maxWidth={200} />
                        <LoadingSkeleton.Line maxWidth={600} />
                        <LoadingSkeleton.Line maxWidth={500} />
                    </div>)
                )}
            </section>
            <section>
                <p className={styles.warrantyOptionsTitle}>
                    <FormattedMessage {...messages.Choose} />:
                </p>
                <div className={styles.priceContainer}>
                    <WarrantyOptions
                        parentSku={parentSku}
                        initialOption={initialOption}
                        options={options}
                        onOptionSelected={onOptionSelected}
                        warrantyTermsAndConditionUrl={warrantyTermsAndConditionUrl}
                        className={styles.warrantyOptions}
                        trackEngagements={trackEngagements}
                        disabled={disableCtas}
                    />
                    <p className={styles.price}>
                        <span>
                            {isGspLoading ? (
                                <LoadingSkeleton.Price />
                            ) : (
                                formatPrice(initialOption ? initialOption.regularPrice : 0, locale)
                            )}
                        </span>
                    </p>
                </div>
            </section>
        </div>
    );
};

export default GspPlan;
