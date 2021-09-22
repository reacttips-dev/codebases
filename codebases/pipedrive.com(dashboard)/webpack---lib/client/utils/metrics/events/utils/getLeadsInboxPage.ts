import { LeadFilterStatus } from 'Types/types';

export function getLeadsInboxPage(leadFilterStatus: LeadFilterStatus): 'inbox' | 'archived' {
	if (leadFilterStatus === 'ARCHIVED') {
		return 'archived';
	}

	return 'inbox';
}
