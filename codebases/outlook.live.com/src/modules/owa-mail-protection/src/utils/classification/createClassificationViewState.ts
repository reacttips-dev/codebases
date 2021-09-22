import type MessageClassificationType from 'owa-service/lib/contract/MessageClassificationType';

export default function createClassificationViewState(classification: MessageClassificationType) {
    return {
        messageClassification: classification,
    };
}
