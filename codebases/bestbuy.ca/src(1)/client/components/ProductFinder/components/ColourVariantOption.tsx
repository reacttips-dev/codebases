import * as React from "react";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {Loader, LoadingSkeleton} from "@bbyca/bbyca-components";
import {Props as PhoneOptionProps} from "components/ProductFinder/components/PhoneOption";
import VariantSwatch from "../../VariantSwatch";
import {LeafOption} from "../ProductFinderOptions";
import * as styles from "../styles.css";
import {ProductVariant} from "models";

interface ColourVariantOptionProps {
    colorName?: string;
    options: LeafOption[];
    sku: string;
}

type Props = ColourVariantOptionProps & PhoneOptionProps & InjectedIntlProps;

export const ColourVariantOptionSkeleton = () => (
    <LoadingSkeleton.Banner width={100} className={styles.skeletonLoader} />
);

export class ColourVariantOption extends React.Component<Props, {}> {
    public render() {
        const {className, colorName, groupName, loading, onChange, options, sku} = this.props;

        return (
            <Loader loading={loading} loadingDisplay={<ColourVariantOptionSkeleton />}>
                <VariantSwatch
                    loadingVariants={false}
                    pageSku={sku}
                    colorName={colorName}
                    containerClass={className}
                    className={styles.colorVariantSwatches}
                    data-automation="color-variant-option"
                    productVariants={(options && options.map(this.mapToVariantProduct)) || []}
                    baseSwatchUrl={"https://multimedia.bbycastatic.ca"}
                    isLink={false}
                    onChange={(skuNumber: string) => {
                        const option = options.find((opt) => {
                            return opt.product.sku === skuNumber;
                        });
                        onChange(groupName, (option && option.label) || "");
                    }}
                />
            </Loader>
        );
    }
    private mapToVariantProduct = (option: LeafOption): ProductVariant => {
        return {
            sku: `${option.product.sku}`,
            name: option.label,
        };
    };
}

export default injectIntl(ColourVariantOption);
