import * as React from "react";
import {useState, useEffect} from "react";
import {connect} from "react-redux";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";

import {GlobalErrorMessage, GlobalInfoMessage, GlobalSuccessMessage, LoadingSpinner} from "@bbyca/bbyca-components";
import {
    LineItemType,
    RequiredProduct,
    formatPrice,
    isOneOfCannotCheckoutShippingStatus,
} from "@bbyca/ecomm-checkout-components";
import {ProductServices} from "@bbyca/ecomm-checkout-components/dist/components";
import {ProductService} from "@bbyca/ecomm-checkout-components/dist/business-rules/entities/ProductServices";

import {FeatureToggles} from "config";
import {
    CartLineItemAvailability,
    PromotionalBadges,
    Warranty,
    WarrantyType,
    BenefitsMessage,
    Region,
    ChildLineItem,
    Summary,
    Promotion,
    Product,
} from "models";
import {AvailabilityShippingStatus} from "models/Availability";
import {State} from "store";
import {getBenefitsMessageForSku} from "store/selectors";

import GspPlan from "../../../../components/GspPlan";
import RequiredPartsItem from "./RequiredPartsItem";
import * as styles from "./styles.css";
import messages from "./translations/messages";
import ParentProduct from "./ParentProduct";
import {classname, classIf} from "utils/classname";
import Status from "./Status";
import SubTotal from "./SubTotal";
import PromotionItems from "./PromotionItems";
import FreeItems from "./FreeItem";
import RemovedItemMessaging from "../RemovedItemMessaging";

const MAX_QUANTITY: number = 99;

export interface LineItemProps {
    availability: CartLineItemAvailability;
    benefitsMessage?: BenefitsMessage;
    childLineItems?: ChildLineItem[];
    ehfRegions: Region[];
    errorType?: string;
    features?: FeatureToggles;
    fetchRequiredProducts: (sku: string | null) => void;
    fetchWarrantyBenefits: (sku: string | null) => Promise<BenefitsMessage | void>;
    id: string;
    isLightweightBasketEnabled: boolean;
    isRequiredProductsLoading: boolean;
    loading: boolean;
    onRemoveChildItem: (lineItemId: string, childItemId: string) => void;
    onRemoveItem: (lineItemId: string, sku: string) => void;
    onSaveItemForLater: (lineItemId: string, sku: string) => void;
    onUpdateItemQuantity: (lineItemId: string, quantity: number) => void;
    product: Product;
    promotionalBadges?: PromotionalBadges;
    promotions?: Promotion[];
    regionCode: Region;
    removed?: boolean;
    requiredProducts: RequiredProduct[];
    selectedWarranty: Warranty | null;
    shippingStatus: AvailabilityShippingStatus;
    summary: Summary;
    updateWarrantyForSkuInCart: (parentSku: string, warranty: Warranty | null) => void;
    warrantyOptions: Warranty[];
    warrantyTermsAndConditionUrl: string;
    type: LineItemType;
    savedForLater?: boolean;
    saveForLaterError?: boolean;
    productServicesEnabled: boolean;
    productServices: ProductService[];
    getRelatedServices: (sku: string) => void;
    updateServicesForSku: (sku: string, services: string[]) => void;
}

export const LineItem: React.FC<LineItemProps & InjectedIntlProps> = ({
           availability,
           ehfRegions,
           errorType,
           intl,
           regionCode,
           shippingStatus,
           childLineItems,
           summary,
           requiredProducts,
           selectedWarranty,
           warrantyOptions,
           warrantyTermsAndConditionUrl,
           benefitsMessage,
           loading,
           id,
           isRequiredProductsLoading,
           promotions,
           onRemoveChildItem,
           onUpdateItemQuantity,
           onRemoveItem,
           fetchRequiredProducts,
           fetchWarrantyBenefits,
           updateWarrantyForSkuInCart,
           product,
           removed,
           onSaveItemForLater,
           savedForLater: saved,
           saveForLaterError: saveError,
           productServicesEnabled = false,
           productServices,
           getRelatedServices,
           updateServicesForSku,
       }) => {
           const [deleting, setDeleting] = useState(false);
           const [localUpdate, setLocalUpdate] = useState(false);
           const [lineItemRemoved, setLineItemRemoved] = useState(!!removed);

           useEffect(() => {
               fetchRequiredProducts(product.sku);
           }, []);

           useEffect(() => {
               if (productServicesEnabled) {
                   getRelatedServices(product.sku);
               }
           }, [productServicesEnabled]);

           useEffect(() => {
               if (!loading && localUpdate) {
                   setDeleting(false);
                   setLocalUpdate(false);
               }
           }, [loading]);

           useEffect(() => {
               if (removed) {
                   setLineItemRemoved(true);
               }
           }, [removed]);

           const handleRemoveChildItemClick = (childItemId: string) => {
               setLocalUpdate(true);
               onRemoveChildItem(id, childItemId);
           };

           const handleRemoveItemClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
               e.preventDefault();

               setDeleting(true);
               setLocalUpdate(true);
               onRemoveItem(id, product.sku);
           };

           const handleSaveForLaterClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
               e.preventDefault();

               setDeleting(true);
               setLocalUpdate(true);
               onSaveItemForLater(id, product.sku);
           };

           const handleQuantityChange = (quantity: number) => {
               setLocalUpdate(true);
               onUpdateItemQuantity(id, quantity);
           };

           const handleWarrantyChange = (sku: string, selection: Warranty | null) => {
               setLocalUpdate(true);
               updateWarrantyForSkuInCart(sku, selection);
           };

           const orderLimit = calculateOrderLimit(product.offer.orderLimit, childLineItems);
           const isLoadingLocalUpdate = localUpdate;
           const canCheckOut: boolean = !isOneOfCannotCheckoutShippingStatus(shippingStatus);

           const [requiredParts, childrenFreeItems, selectedServices] = React.useMemo(() => {
               const memoizedRequiredParts =
                   (childLineItems && childLineItems.filter(({type}) => type === LineItemType.RequiredPart)) || [];
               const memoizedChildrenFreeItems =
                   (childLineItems && childLineItems.filter((child) => child.type === LineItemType.FreeItem)) || [];
               const memoizedSelectedServices =
                   childLineItems?.reduce<string[]>(
                       (currentItems, child) =>
                           child.type === LineItemType.Service ? [...currentItems, child.product.sku] : currentItems,
                       [],
                   ) || [];
               return [memoizedRequiredParts, memoizedChildrenFreeItems, memoizedSelectedServices];
           }, [childLineItems]);

           const formattedTotalSavings = formatPrice(summary.savings, intl.locale);
           const formattedSubTotal = formatPrice(summary.subtotal, intl.locale);
           const hasSavings = !isNaN(summary.savings) && summary.savings !== 0;

           return (
               <div
                   id={`lineitem-${id}`}
                   data-sku={product.sku}
                   className={classname([
                       styles.lineItemContainer,
                       classIf(styles.removedItem, lineItemRemoved),
                       classIf(styles.savedItem, saved || false),
                       classIf(styles.deleteLoading, deleting),
                       classIf(styles.saveItemError, saveError || false),
                       `scroll-target-${product.sku}`,
                   ])}>
                   <RemovedItemMessaging
                       parentName={product.name}
                       childLineItems={childLineItems}
                       className={styles.removedItemMessaging}
                   />
                   <div className={styles.savedItemMessage}>
                       <GlobalSuccessMessage>
                           <FormattedMessage {...messages.ItemSaved} values={{skuName: product.name}} />
                       </GlobalSuccessMessage>
                   </div>
                   <div className={styles.lineItem}>
                       <div className={styles.loadingBlock}>
                           <LoadingSpinner width="40px" />
                       </div>
                       <div className={styles.container}>
                           <section className={styles.lineItemBlock} data-automation="lineitem-parentproduct">
                               <Status shippingStatus={shippingStatus} currentRegion={regionCode} />
                               <div className={styles.savedItemErrorMessage}>
                                   <GlobalErrorMessage>
                                       <FormattedMessage {...messages.ItemSaveError} />
                                   </GlobalErrorMessage>
                               </div>
                               <ParentProduct
                                   product={product}
                                   displayEhfRegions={ehfRegions}
                                   regionCode={regionCode}
                                   onParentItemRemove={handleRemoveItemClick}
                                   quantity={{
                                       hasQuantityUpdateError:
                                           (errorType && errorType === "errorUpdateQuantity") || undefined,
                                       quantity: summary.quantity,
                                       onChange: handleQuantityChange,
                                       max: orderLimit,
                                       disableButtons: !canCheckOut,
                                   }}
                                   onSaveItemForLater={handleSaveForLaterClick}
                                   availability={availability}
                               />
                               {orderLimit && orderLimit === summary.quantity && orderLimit !== MAX_QUANTITY && (
                                   <section className={styles.orderLimit}>
                                       <div className="house-limit">
                                           <GlobalInfoMessage
                                               message={intl.formatMessage(messages.OrderLimit, {orderLimit})}
                                           />
                                       </div>
                                   </section>
                               )}
                           </section>
                           {shouldRenderRequiredParts(isRequiredProductsLoading, requiredProducts) && (
                               <section className={styles.lineItemBlock} data-automation="lineitem-requiredparts">
                                   <RequiredPartsItem
                                       areAllRequiredProductsInCart={
                                           requiredParts &&
                                           requiredProducts &&
                                           requiredParts.length === requiredProducts.length
                                       }
                                       disabled={!canCheckOut}
                                       requiredParts={requiredParts}
                                       parentSku={product.sku}
                                       onRemoveChildItem={handleRemoveChildItemClick}
                                   />
                               </section>
                           )}

                           {shouldRenderProductServices(productServicesEnabled, productServices) && (
                               <section className={styles.lineItemBlock} data-automation="lineitem-services">
                                   <ProductServices
                                       services={productServices}
                                       selectedServices={selectedServices}
                                       selectable
                                       hideBenefits
                                       addOrRemoveMode
                                       onChange={(services: string[]) => {
                                           updateServicesForSku(product.sku, services);
                                       }}
                                   />
                               </section>
                           )}
                           {shouldRenderGsp(warrantyOptions) && (
                               <section className={styles.lineItemBlock} data-automation="lineitem-gsp">
                                   <GspPlan
                                       initialOption={selectedWarranty}
                                       locale={intl.locale as Locale}
                                       onOptionSelected={handleWarrantyChange}
                                       options={warrantyOptions}
                                       warrantyTermsAndConditionUrl={warrantyTermsAndConditionUrl}
                                       parentSku={product.sku}
                                       fetchWarrantyBenefits={fetchWarrantyBenefits}
                                       benefitsMessage={benefitsMessage}
                                       trackEngagements={true}
                                       disableCtas={!canCheckOut}
                                       isGspLoading={isLoadingLocalUpdate}
                                   />
                               </section>
                           )}
                           {childrenFreeItems.length > 0 && (
                               <section className={styles.lineItemBlock}>
                                   <FreeItems items={childrenFreeItems} onRemove={handleRemoveChildItemClick} />
                               </section>
                           )}
                           <section className={styles.lineItemBlock} data-automation="lineitem-subtotal">
                               {promotions && promotions.length > 0 && hasSavings && (
                                   <PromotionItems
                                       className={styles.promotionItems}
                                       totalSavings={formattedTotalSavings}
                                       promotions={promotions}
                                       loading={isLoadingLocalUpdate}
                                   />
                               )}
                               <SubTotal
                                   className={styles.subTotal}
                                   loading={isLoadingLocalUpdate}
                                   subTotal={formattedSubTotal}
                               />
                           </section>
                       </div>
                   </div>
               </div>
           );
       };

const shouldRenderRequiredParts = (isRequiredProductsLoading: boolean, requiredProducts: RequiredProduct[]): boolean =>
    !isRequiredProductsLoading && !!requiredProducts && requiredProducts.length > 0;

const shouldRenderProductServices = (productServicesEnabled: boolean, productServices: ProductService[]): boolean =>
    productServicesEnabled && !!productServices?.length;

const shouldRenderGsp = (warrantyOptions: Warranty[]): boolean => {
    const hasAvailableGsp =
        !!warrantyOptions &&
        !!warrantyOptions.find((plan) => plan.type === WarrantyType.PSP || plan.type === WarrantyType.PRP);

    return hasAvailableGsp;
};

const calculateOrderLimit = (orderLimit?: number, childLineItems?: ChildLineItem[]): number => {
    const max = orderLimit || MAX_QUANTITY;
    if (childLineItems) {
        return childLineItems.reduce((minOrderLimit, childLineItem) => {
            const defaultOrderLimit = childLineItem.product.offer.orderLimit || MAX_QUANTITY;
            return defaultOrderLimit < minOrderLimit ? defaultOrderLimit : minOrderLimit;
        }, max);
    }
    return max;
};

const mapStateToProps = (state: State, {product: {sku}}: LineItemProps): Partial<LineItemProps> => ({
    benefitsMessage: getBenefitsMessageForSku(sku)(state),
});

export const LineItemWithIntl = injectIntl(LineItem);

export default connect(mapStateToProps)(LineItemWithIntl);
