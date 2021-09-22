import * as React from "react";
import {Expandable, DisplayLimitText} from "@bbyca/bbyca-components";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {IBrowser as ScreenSize} from "redux-responsive";
import {BundleProduct, DetailedProduct, isBundle} from "models";

import messages from "./translations/messages";
import * as styles from "./style.css";
import ProductDescription from "./components/ProductDescription";
import ConstituentContainer, {ConstituentContainerProps} from "../../ConstituentContainer";
import useTrackTabVisit from "hooks/useTrackVisit";
import {classIf, classname} from "utils/classname";

export interface ExpandableConstituentMoreInformationProps
    extends InjectedIntlProps,
        ConstituentContainerProps,
        Pick<BundleProduct, "shortDescription"> {
    limitWords?: number;
    totalConstituents: number;
}

export const ExpandableConstituentMoreInformation: React.FC<ExpandableConstituentMoreInformationProps> = ({
    intl,
    index,
    totalConstituents,
    productImage,
    name,
    sku,
    shortDescription,
    limitWords = 50,
}) => {
    const headerText = intl.formatMessage(messages.moreInformationExpandableReadMore);
    const toggleHeaderText = intl.formatMessage(messages.moreInformationExpandableShowLess);

    return (
        <ConstituentContainer
            productImage={productImage}
            name={name}
            sku={sku}
            totalConstituents={totalConstituents}
            index={index}
            className={"moreInfo"}>
            <Expandable
                direction="up"
                variant="compact"
                className={styles.readMoreToggle}
                toggleHeaderText={toggleHeaderText}
                headerText={headerText}
                dataAutomation={`pdp-bundle-more-description-expandable-btn-${index}`}>
                <DisplayLimitText className={styles.readMoreBody} limitWords={limitWords} text={shortDescription} />
            </Expandable>
        </ConstituentContainer>
    );
};

export type VanillaConstituentMoreInformationProps = ConstituentContainerProps &
    Pick<BundleProduct, "shortDescription">;

export const VanillaConstituentMoreInformation: React.FC<VanillaConstituentMoreInformationProps> = ({
    productImage,
    name,
    sku,
    totalConstituents,
    index,
    shortDescription,
}) => {
    return (
        <ConstituentContainer
            productImage={productImage}
            name={name}
            sku={sku}
            totalConstituents={totalConstituents}
            index={index}
            className={"moreInfo"}>
            <ProductDescription description={shortDescription} />
        </ConstituentContainer>
    );
};

export interface ConstituentMoreInformationProps {
    product: DetailedProduct;
    limitWords?: number;
}

export const ConstituentMoreInformation: React.FC<ConstituentMoreInformationProps> = React.memo(
    ({product, limitWords = 50}) => {
        const constituents = product.bundleProducts
            .map((constituent: BundleProduct, index) => {
                const isReadMore =
                    constituent.shortDescription && constituent.shortDescription.split(" ").length > limitWords;

                const InjectedExpandableConstituentMoreInfo = injectIntl(ExpandableConstituentMoreInformation);
                if (!!constituent.shortDescription) {
                    const constituentProps = {...constituent, index, totalConstituents: product.bundleProducts.length};
                    return !!isReadMore ? (
                        <InjectedExpandableConstituentMoreInfo
                            key={index}
                            limitWords={limitWords}
                            {...constituentProps}
                        />
                    ) : (
                        <VanillaConstituentMoreInformation key={index} {...constituentProps} />
                    );
                }
                return null;
            })
            .filter(Boolean);

        return <>{constituents}</>;
    },
);

export interface MoreInformationProps {
    product: DetailedProduct;
    screenSize: ScreenSize;
    supportContent?: JSX.Element | React.Component;
}

export const MoreInformation: React.FC<MoreInformationProps> = ({product, supportContent, screenSize}) => {
    const {ref} = useTrackTabVisit({
        payload: {
            sku: product.sku,
            customLink: "More Information Impression",
        },
        event: "PDP_TAB_IMPRESSION",
    });
    const bundle = isBundle(product);
    return (
        <div className={classname([styles.moreInformation, classIf(styles.bundle, bundle)])} ref={ref}>
            {bundle ? (
                <ConstituentMoreInformation product={product} />
            ) : (
                <ProductDescription description={product.longDescription} />
            )}

            {supportContent && screenSize.greaterThan.small && (
                <div className={styles.supportContent}>{supportContent}</div>
            )}
        </div>
    );
};

ProductDescription.displayName = "ProductDescription";

export default MoreInformation;
