import type LinkedEntityPreview from './LinkedEntityPreview';

export default interface LinkedEntity {
    Id: string;
    WebLink: string;
    EntityType: string;
    EntitySubtype: string;
    DisplayName: string;
    Preview?: LinkedEntityPreview;
}

export const EMAIL_ENTITY_TYPE = 'message';
