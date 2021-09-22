import {defineMessages, FormattedMessage} from "react-intl";

const config = {
    header: {
        id: "productList.header",
    },
    items: {
        id: "productList.items",
    },
    fetchError: {
        id: "productList.fetchError",
    },
    noSavedItemsMsg: {
        id: "productList.noSavedItemsMsg",
    },
};

const messages: {[k in keyof typeof config]: FormattedMessage.MessageDescriptor} = defineMessages(config);

export default messages;
