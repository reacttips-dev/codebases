import type { IdType } from '../schema/SharingData';
import { action } from 'satcheljs';

export const refreshExpirationDate = action('REFRESH_EXPIRATION_DATE', (id: IdType) => ({
    id: id,
}));
