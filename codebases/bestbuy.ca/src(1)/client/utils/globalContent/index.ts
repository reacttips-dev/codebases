import {ContextItemTypes, GlobalCMSContext, GlobalCMSContextMap, GlobalCMSContexts} from "models";
import {OwnProps as GlobalContentProps} from "../../components/GlobalContent";

export const getGlobalContentPropsByContext = (context: GlobalCMSContexts): GlobalContentProps | undefined => {
    return !!context ? {context, contentType: ContextItemTypes.customContent} : undefined;
};

export const getGlobalContentContexts = (
    globalContent: GlobalCMSContextMap,
    contexts: GlobalCMSContexts[],
): GlobalCMSContext[] => {
    if (!globalContent) {
        return [];
    } else {
        return (Object.keys(globalContent) as any[]).reduce(
            (acc: GlobalCMSContext[], currentContext: GlobalCMSContexts) => {
                return contexts.includes(currentContext) ? [...acc, globalContent[currentContext]] : [...acc];
            },
            [],
        );
    }
};
