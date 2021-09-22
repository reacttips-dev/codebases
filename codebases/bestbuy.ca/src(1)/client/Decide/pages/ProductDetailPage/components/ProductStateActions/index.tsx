import * as React from "react";
import {connect} from "react-redux";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {bindActionCreators, Dispatch} from "redux";
import {ProductService} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities/ProductServices";

import {State} from "store";
import getLogger from "common/logging/getLogger";
import {getNavigationActions, AppActions} from "actions";
import {Warranty, Availability} from "models";
import {FeatureToggles} from "config";
import {FEATURE_TOGGLES} from "config/featureToggles";
import {
    getIntlLanguage,
    getGeekSquadSubscriptionSKU,
    isRpuEnabled as isRpuEnabledSelector,
    isAddToCartEnabled as isAddToCartEnabledSelector,
    isKiosk as isKioskEnv,
    isDisabledWithMCF as isDisabledWithMCFSelector,
    getFeatureToggle,
} from "store/selectors";

import {
    isGeekSquadMembershipDialogOpen as isGeekSquadMembershipDialogOpenSelector,
    isAvailabilityError as isAvailabilityErrorSelector,
    getProductAvailability,
    getProductSku,
    getProductWarranties,
    hasRequiredProducts as hasRequiredProductsSelector,
    getProductServices,
} from "../../../../store/selectors";
import {
    geekSquadMembershipDialogActionCreators,
    productActionCreators,
    addOnsPageActionCreators,
    basketActionCreators,
} from "../../../../actions";
import ProductToolbar from "../ProductToolbar";
import GeekSquadMembershipDialog from "../GeekSquadMembershipDialog";
import {sendConversionAnalytics} from "../../utils/bazaarVoiceAnalytics";

export interface StateProps {
    availability: Availability;
    features?: FeatureToggles;
    geekSquadSubscriptionSKU: string | undefined;
    hasRequiredProducts: boolean;
    isAddToCartEnabled: boolean;
    isAvailabilityError: boolean;
    isGeekSquadMembershipDialogOpen: boolean;
    isRpuEnabled: boolean;
    language: Language;
    sku: string;
    warranties: Warranty[];
    isKiosk: boolean;
    isDisabledWithMCF: boolean;
    productServicesEnabled: boolean;
    productServices: ProductService[];
}

export interface OwnProps {
    selectedWarranty: Warranty | null;
}

const mapStateToProps = (state: State): StateProps => ({
    availability: getProductAvailability(state),
    geekSquadSubscriptionSKU: getGeekSquadSubscriptionSKU(state),
    hasRequiredProducts: hasRequiredProductsSelector(state),
    isAddToCartEnabled: isAddToCartEnabledSelector(state),
    isAvailabilityError: isAvailabilityErrorSelector(state),
    isGeekSquadMembershipDialogOpen: isGeekSquadMembershipDialogOpenSelector(state),
    isRpuEnabled: isRpuEnabledSelector(state),
    language: getIntlLanguage(state),
    sku: getProductSku(state),
    warranties: getProductWarranties(state),
    isDisabledWithMCF: isDisabledWithMCFSelector(state),
    isKiosk: isKioskEnv(state),
    productServicesEnabled: getFeatureToggle(FEATURE_TOGGLES.productServicesEnabled)(state) as boolean,
    productServices: getProductServices(getProductSku(state))(state)
});

const mapDispatchToProps = (dispatch: Dispatch<AppActions>) => ({
    actions: bindActionCreators(productActionCreators, dispatch),
    geekSquadMembershipDialogActions: bindActionCreators(geekSquadMembershipDialogActionCreators, dispatch),
    viewCart: bindActionCreators(getNavigationActions().viewCart, dispatch),
    goToCartPage: () => dispatch(basketActionCreators.goToCartPage()),
    addOnsPageActions: bindActionCreators(addOnsPageActionCreators, dispatch),
});

export type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ReturnType<typeof mapDispatchToProps> &
    InjectedIntlProps;

export class ProductStateActions extends React.Component<Props> {
    public render() {
        const {
            sku,
            selectedWarranty,
            isAvailabilityError,
            availability,
            geekSquadMembershipDialogActions,
            isGeekSquadMembershipDialogOpen,
            warranties,
            hasRequiredProducts,
            isRpuEnabled,
            isAddToCartEnabled,
            isKiosk,
            isDisabledWithMCF,
            productServicesEnabled,
            productServices
        } = this.props;

        if (!sku) {
            return null;
        }

        const hasWarrantyOptions = warranties && warranties.length > 0;

        const hasWarrantySelected = !!selectedWarranty;

        const shouldGotoAddOnsPage =
            hasRequiredProducts ||
            (hasWarrantyOptions && !hasWarrantySelected) ||
            (productServicesEnabled && productServices?.length > 0);

        return (
            <>
                <ProductToolbar
                    onAddToCart={this.onAddToCart}
                    onAddToCartConfirmation={shouldGotoAddOnsPage ? this.goToRequiredProductsInterstitial : undefined}
                    onReserveInStoreButtonClick={this.onReserveInStoreButtonClick}
                    onGotoBasketPage={this.onGotoViewCartHandler}
                    isAvailabilityError={isAvailabilityError}
                    availability={availability}
                    isRpuEnabled={isRpuEnabled}
                    isAddToCartEnabled={isAddToCartEnabled}
                    isSubscription={this.isSubscription()}
                    selectedWarranty={selectedWarranty}
                    geekSquadMembershipSubscriptionDialogActions={geekSquadMembershipDialogActions}
                    isDisabled={isKiosk ? isDisabledWithMCF : false}
                />
                <GeekSquadMembershipDialog
                    isOpen={isGeekSquadMembershipDialogOpen}
                    close={geekSquadMembershipDialogActions.close}
                    isAddToCartEnabled={isAddToCartEnabled}
                    availability={availability}
                    onGotoBasketPage={this.onGotoViewCartHandler}
                />
            </>
        );
    }

    private goToRequiredProductsInterstitial = () => {
        this.props.addOnsPageActions.updateParentItemJustAdded(true);
        this.props.addOnsPageActions.goToRequiredProducts(this.props.sku, this.props.language);
    };

    private onAddToCart = () => {
        sendConversionAnalytics({type: "AddToCart", value: 1, label: "PDP - Add to Cart (Primary)"});
        return true;
    };

    private onReserveInStoreButtonClick = async () => {
        const selectedWarrantySku = this.props.selectedWarranty ? this.props.selectedWarranty.sku : undefined;

        try {
            sendConversionAnalytics({type: "BuyNow", value: 1, label: "PDP - RPU (Primary)"});
            await this.props.actions.reserveInStore(
                {
                    items: [
                        {
                            sku: this.props.sku,
                            quantity: 1,
                            ...(selectedWarrantySku ? {selectedWarrantySku} : {}),
                        },
                    ],
                },
                {rpuFrom: "pdp"},
            );
        } catch (error) {
            getLogger().error(error);
        }
    };

    private isSubscription = () => {
        return (this.props.geekSquadSubscriptionSKU && this.props.geekSquadSubscriptionSKU === this.props.sku) || false;
    };

    private onGotoViewCartHandler = () => {
        this.props.goToCartPage();
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(ProductStateActions));
