import './orchestrators/NewMessageV3Orchestrator';
import './orchestrators/onCreateFeedbackForCortana';
import { LazyAction, LazyModule, LazyActionOptions } from 'owa-bundling';

const lazyActionOptions: LazyActionOptions = { captureBundleTime: true };
const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailMessageActions"*/ './lazyIndex')
);

export let lazyNewMessage = new LazyAction(lazyModule, m => m.newMessage, lazyActionOptions);
export let lazyReplyToConversation = new LazyAction(lazyModule, m => m.replyToConversation);
export let lazyForwardConversation = new LazyAction(lazyModule, m => m.forwardConversation);
export let lazyPrintConversation = new LazyAction(lazyModule, m => m.printConversation);
export let lazyReplyToItem = new LazyAction(lazyModule, m => m.replyToItem);
export let lazyForwardItem = new LazyAction(lazyModule, m => m.forwardItem);
export let lazyPrintItem = new LazyAction(lazyModule, m => m.printItem);
export let lazyShowConversationInImmersiveReader = new LazyAction(
    lazyModule,
    m => m.showConversationInImmersiveReader
);
export let lazyReplyWithText = new LazyAction(lazyModule, m => m.replyWithText);
export { default as ReplyWithTextFeatures } from './contract/ReplyWithTextFeatures';
