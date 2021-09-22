import {ProductContent, ProductMessageType, ContextType} from "models";

const getTargettedContent = (
    targettedContent: ProductContent,
    contextType: ContextType,
    messageType?: ProductMessageType,
) => {
    const {contexts, sections} = targettedContent;

    if (contexts && contexts[contextType]) {
        return contexts[contextType].items;
    } else if (messageType && sections && sections.length) {
        const match = sections.find((section: any) => section.items.find((item) => item.messageType === messageType));
        return match && match.items ? match.items : [];
    } else {
        return [];
    }
};

export default getTargettedContent;
