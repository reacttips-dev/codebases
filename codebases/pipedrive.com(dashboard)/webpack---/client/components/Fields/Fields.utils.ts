import { ModalType } from 'Types/types';

export const getDealFieldKey = (): string => {
	return 'deal_id';
};

export const getPersonFieldKey = (modalType: ModalType): string => {
	return modalType === 'lead' ? 'related_person_id' : 'person_id';
};

export const getOrgFieldKey = (modalType: ModalType): string => {
	return modalType === 'lead' ? 'related_org_id' : 'org_id';
};

export const getOwnerFieldKey = (modalType: ModalType): string => {
	return ['lead', 'project'].includes(modalType) ? 'owner_id' : 'user_id';
};
