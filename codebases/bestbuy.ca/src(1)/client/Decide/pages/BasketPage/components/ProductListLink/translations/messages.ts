import {defineMessages, FormattedMessage} from "react-intl";

const config = {
    youAlsoHave: {
        id: "productListLink.youAlsoHave",
    },
    items: {
        id: "productListLink.items",
    },
};

const messages: {[k in keyof typeof config]: FormattedMessage.MessageDescriptor} = defineMessages(config);

export default messages;
