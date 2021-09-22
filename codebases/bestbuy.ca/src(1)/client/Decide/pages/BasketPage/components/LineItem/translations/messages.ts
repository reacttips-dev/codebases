import {defineMessages, FormattedMessage} from "react-intl";

const messages: {[key: string]: FormattedMessage.MessageDescriptor} = defineMessages({
    Add: {
        defaultMessage: "Add",
        description: "Child item Add button",
        id: "components.BasketPage.LineItem.Add",
    },
    EHFLabel: {
        defaultMessage: "EHF",
        description: "Label for EHF",
        id: "components.BasketPage.LineItem.EHFLabel",
    },
    GrpItemHook: {id: "components.BasketPage.GrpItem.Hook"},
    GspItemBenefit: {
        defaultMessage: "GSP Benefit tile ",
        description: "GSP Benefit title",
        id: "components.BasketPage.GspItem.Benefit",
    },
    GspItemHook: {id: "components.BasketPage.GspItem.Hook"},
    GspItemTitle: {
        defaultMessage: "GSP Title",
        description: "GSP Title",
        id: "components.BasketPage.GspItem.Title",
    },
    ItemSubtotal: {
        defaultMessage: "Item Subtotal",
        description: "line item subtotal heading",
        id: "components.BasketPage.LineItem.ItemSubtotal",
    },
    OrderLimit: {
        defaultMessage: "Limit of {orderLimit} per household for current offer.",
        description: "Quatitity for house limit",
        id: "components.BasketPage.LineItem.OrderLimit",
    },
    PromotionalDiscount: {
        defaultMessage: "Promotional Discount",
        description: "Promotional Discount header",
        id: "components.BasketPage.LineItem.PromotionalDiscount",
    },
    Quantity: {
        defaultMessage: "Quantity",
        description: "line item quantity text",
        id: "components.BasketPage.LineItem.Quantity",
    },
    SaleEnds: {
        defaultMessage: "Sale Ends",
        description: "sale ends text",
        id: "components.BasketPage.LineItem.SaleEnds",
    },
    SeeRequiredPartsDescription: {
        description: "description of line item description if a parent item needs required parts",
        id: "components.BasketPage.SeeRequiredPartsDescription",
    },
    SeeRequiredPartsHeader: {
        description: "header of line item description if a parent item needs required parts",
        id: "components.BasketPage.SeeRequiredPartsHeader",
    },
    SeeRequiredPartsLinkText: {
        description: "link text of line item description if a parent item needs required parts",
        id: "components.BasketPage.SeeRequiredPartsLinkText",
    },
    StillAbleToCheckout: {
        defaultMessage: "You can continue to checkout without this item",
        description: "still able to checkout text",
        id: "components.BasketPage.LineItem.StillAbleToCheckout",
    },
    deliveryEstimateText: {id: "components.BasketPage.LineItem.DeliveryEstimateText"},
    noPlan: {id: "components.BasketPage.ServicePlan.noPlan"},
    year: {id: "components.BasketPage.ServicePlan.year"},
    manufacturerWarrantyLink: {id: "components.BasketPage.TermsAndConditionsMsg.ManufacturerWarrantyLink"},
    quebecWarrantyLink: {id: "components.BasketPage.TermsAndConditionsMsg.QuebecWarrantyLink"},
    termsAndConditionsLink: {id: "components.BasketPage.TermsAndConditionsMsg.TermsAndConditionsLink"},
    termsAndConditionsMsg: {id: "components.BasketPage.TermsAndConditionsMsg.TermsAndConditionsMsg"},
    warnAcceptWarranty: {id: "components.BasketPage.TermsAndConditionsMsg.WarnAcceptWarranty"},
    ItemSaved: {id: "components.BasketPage.LineItem.ItemSaved"},
    ItemSaveError: {id: "components.BasketPage.LineItem.ItemSaveError"},
});

export default messages;
