import {defineMessages, FormattedMessage} from "react-intl";

const messages: {[key: string]: FormattedMessage.MessageDescriptor} = defineMessages({
    heading: {id: "BasketPage.Heading"},
    title: {id: "BasketPage.Title"},
    continueShopping: {
        defaultMessage: "Continue Shopping",
        description: "continue shopping button",
        id: "BasketPage.ContinueShopping",
    },
    emptyCartHaveAccount: {
        defaultMessage: "Do you have an account?",
        description: "account prompt",
        id: "BasketPage.EmptyCartHaveAccount",
    },
    emptyCartSignIn: {
        defaultMessage: "Sign In",
        description: "sign in button text",
        id: "BasketPage.EmptyCartSignIn",
    },
    errorAddWarranty: {id: "BasketPage.ErrorAddWarranty"},
    errorFallbackMessage: {
        defaultMessage: "Sorry, something went wrong.",
        id: "BasketPage.FallbackMessage",
    },
    errorLoadCart: {id: "BasketPage.ErrorLoadCart"},
    errorRemoveItem: {id: "BasketPage.ErrorRemoveItem"},
    errorRemoveWarranty: {id: "BasketPage.ErrorRemoveWarranty"},
    errorUpdateQuantity: {id: "BasketPage.ErrorUpdateQuantity"},
    estimatedTotal: {
        defaultMessage: "Estimated Total",
        description: "basket summary - estimated total",
        id: "BasketPage.EstimatedTotal",
    },
    everythingIsOutOfStock: {
        defaultMessage: "Everything in your cart is out of stock.",
        description: "Everything in your cart is out of stock.",
        id: "BasketPage.EverythingIsOutOfStock",
    },
    everythingOutOfStockInRegion: {
        defaultMessage: "Everything in your cart is out of stock in {region}.",
        description: "everythingOutOfStockInRegion",
        id: "BasketPage.EverythingOutOfStockInRegion",
    },
    everythingOutOfStockInRegionBody: {
        defaultMessage:
            "You can update your postal code to check availability somewhere else," +
            " or find something else that can be shipped to your province.",
        description: "everythingOutOfStockInRegionBody",
        id: "BasketPage.EverythingOutOfStockInRegionBody",
    },
    everythingRegionRestricted: {
        defaultMessage: "Nothing in your cart can be shipped to {region}.",
        description: "everythingRegionRestricted",
        id: "BasketPage.EverythingRegionRestricted",
    },
    everythingRegionRestrictedBody: {
        defaultMessage:
            "You can update your postal code to check availability somewhere else," +
            " or find something else that can be shipped to your province.",
        description: "everythingRegionRestrictedBody",
        id: "BasketPage.EverythingRegionRestrictedBody",
    },
    householdLimit: {id: "BasketPage.HouseholdLimit"},
    householdLimitOfferError: {id: "BasketPage.HouseholdLimitOfferError"},
    itemAlreadyRemovedError: {id: "BasketPage.ItemAlreadyRemovedError"},
    itemNoLongerAvailable: {id: "BasketPage.ItemNoLongerAvailable"},
    items: {
        defaultMessage: "items",
        description: "items",
        id: "BasketPage.Items",
    },
    lowStock: {id: "BasketPage.LowStock"},
    manufacturerWarrantyLink: {
        id: "BasketPage.ManufaturersWarrantyLink",
    },
    mixOfNonPurchasable: {
        defaultMessage: "The items in your cart aren't available.",
        description: "mixOfNonPurchasable",
        id: "BasketPage.MixOfNonPurchasable",
    },
    mixOfNonPurchasableBody: {
        defaultMessage:
            "You can update your postal code to check availability somewhere else," +
            " or find something else that can be shipped to your province.",
        description: "mixOfNonPurchasableBody",
        id: "BasketPage.MixOfNonPurchasableBody",
    },
    paypalError: {
        defaultMessage: "Sorry, your PayPal payment wasn't completed. Please use another payment method.",
        description: "error message when paypal is canceled, or fails",
        id: "BasketPage.PaypalError",
    },
    whyNotAddSomething: {
        defaultMessage: "Why not add something else?",
        description: "Why not add something else?",
        id: "BasketPage.WhyNotAddSomething",
    },
    soldByEWA: {
        id: "BasketPage.SoldByEWA",
    },
    someItemsNotQPUable: {
        id: "BasketPage.someItemsNotQPUable",
    },
    allItemsNotQPUable: {
        id: "BasketPage.allItemsNotQPUable",
    },
});

export default messages;
