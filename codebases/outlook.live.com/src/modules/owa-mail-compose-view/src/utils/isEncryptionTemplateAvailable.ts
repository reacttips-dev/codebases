import { protectionStore } from 'owa-mail-protection/lib/store/protectionStore';

export default function isEncryptionTemplateAvailable(templateIds?: string[]): boolean {
    const { rmsTemplates, messageClassifications } = protectionStore;

    if (templateIds && templateIds.length > 0) {
        return templateIds.some(
            curValue => rmsTemplates.has(curValue) || messageClassifications.has(curValue)
        );
    }

    return rmsTemplates.size > 0 || messageClassifications.size > 0;
}
