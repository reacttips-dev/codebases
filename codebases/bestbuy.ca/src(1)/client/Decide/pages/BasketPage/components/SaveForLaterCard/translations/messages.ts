import {defineMessages, FormattedMessage} from "react-intl";

const messages: {[key: string]: FormattedMessage.MessageDescriptor} = defineMessages({
    itemRemoved: {id: "productList.saveForLaterCard.itemRemoved"},
    itemRemovedError: {id: "productList.saveForLaterCard.itemRemovedError"},
    itemMovedToCart: {id: "productList.saveForLaterCard.itemMovedToCart"},
    movedItemToCartErrorMessage: {id: "productList.saveForLaterCard.itemMovedToCartError"},
});

export default messages;
