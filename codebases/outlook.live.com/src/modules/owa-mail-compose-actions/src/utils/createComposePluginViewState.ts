import type { ComposePluginViewState } from 'owa-mail-compose-store';
import { createComposeFeedbackViewState } from 'owa-compose-feedback';
import createDockingViewState from 'owa-editor-docking-plugin/lib/utils/createDockingViewState';
import createEmojiPickerViewState from 'owa-editor-emoji-picker-plugin/lib/utils/createEmojiPickerViewState';
import createAtMentionsViewState from 'owa-editor-mentions-picker-plugin/lib/utils/createAtMentionsViewState';
import createTopicViewState from 'owa-editor-topic-picker-plugin/lib/utils/createTopicViewState';
import { createPasteOptionViewState } from 'owa-editor-paste-option-plugin';
import createRibbonViewState from 'owa-editor-ribbonplugin/lib/utils/createRibbonViewState';
import { createForgottenAttachmentsPluginViewState } from 'owa-editor-forgotten-attachments-plugin';
import createInlineImageViewState from 'owa-inline-image/lib/utils/createInlineImageViewState';
import createInlineImageViewStateV2 from 'owa-editor-inlineimage-plugin/lib/utils/createInlineImageViewState';
import createAugLoopViewState from 'owa-editor-augloop-plugin/lib/utils/createAugLoopViewState';
import createProofingViewState from 'owa-editor-proofing-plugin/lib/utils/createProofingViewState';
import createSonoraViewState from 'owa-editor-sonora-plugin/lib/utils/createSonoraViewState';
import createSonoramentionsViewState from 'owa-editor-sonora-mentions-picker-plugin/lib/utils/createSonoraMentionsViewState';
import { createMessageExtensionCardViewState } from 'owa-message-extension-cards';

const DEFAULT_MIN_BODY_HEIGHT = 100;

export default function createComposePluginViewState(
    pendingSocialActivityTags: string[],
    isRibbonShown: boolean,
    isInlineCompose: boolean
): ComposePluginViewState {
    return {
        emojiPicker: createEmojiPickerViewState(),
        docking: createDockingViewState(DEFAULT_MIN_BODY_HEIGHT, true /*allowStickyDocking*/),
        ribbon: createRibbonViewState(),
        mentionsPicker: createAtMentionsViewState(pendingSocialActivityTags),
        topicPicker: createTopicViewState(),
        pasteOption: createPasteOptionViewState(),
        forgottenAttachments: createForgottenAttachmentsPluginViewState(),
        smartCompose: createComposeFeedbackViewState(),
        inlineImage: createInlineImageViewState(),
        inlineImageV2: createInlineImageViewStateV2(),
        augLoop: createAugLoopViewState(),
        proofing: createProofingViewState(),
        sonora: createSonoraViewState(),
        sonoraMentions: createSonoramentionsViewState(),
        messageExtensionCard: createMessageExtensionCardViewState(),
    };
}
