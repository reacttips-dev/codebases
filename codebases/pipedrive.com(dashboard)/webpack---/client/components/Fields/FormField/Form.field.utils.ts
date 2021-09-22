export const isDuplicateDetectionField = (key: string) => ['name', 'address', 'email', 'phone'].includes(key);

export const isContactField = (key: string): boolean =>
	['related_person_id', 'related_org_id', 'person_id', 'org_id'].includes(key);
export const isTitleField = (key: string): boolean => ['title'].includes(key);
export const isOwnerField = (key: string): boolean => ['user_id', 'owner_id'].includes(key);
export const isRenewalTypeField = (key: string): boolean => ['renewal_type'].includes(key);
export const isMarketingStatusField = (key: string): boolean => ['marketing_status'].includes(key);
