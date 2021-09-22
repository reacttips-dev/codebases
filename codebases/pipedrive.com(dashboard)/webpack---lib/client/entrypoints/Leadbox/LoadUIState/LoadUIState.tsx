import React, { ReactNode } from 'react';

import { LeadsListLoader } from './LeadsListLoader';
import { EmptyList } from './EmptyList';
import { EntryPage } from './EntryPage';

type StateType = 'Loading' | 'EmptyList' | 'LandingPage' | 'List';

type UseLoadState = {
	inboxCount?: number | null;
	archivedCount?: number | null;
	leadCount?: number | null;
};

export const getLoadState = ({ inboxCount, archivedCount, leadCount }: UseLoadState): StateType => {
	const isInboxRecordsEmpty = inboxCount === 0;
	const isArchiveRecordsEmpty = archivedCount === 0;
	const isListEmpty = leadCount === 0;

	if (leadCount == null) {
		return 'Loading';
	}

	if (isListEmpty && isInboxRecordsEmpty && isArchiveRecordsEmpty) {
		return 'LandingPage';
	}

	if (isListEmpty) {
		return 'EmptyList';
	}

	return 'List';
};

export const LoadUIState = ({ children, ...counters }: UseLoadState & { children: ReactNode }) => {
	const uiState = getLoadState(counters);

	const UIStates: Record<StateType, React.ReactNode> = {
		Loading: <LeadsListLoader grayed={true} />,
		EmptyList: <EmptyList />,
		LandingPage: <EntryPage />,
		List: children,
	};

	return <>{UIStates[uiState] ?? new Error('Unknown UI State')}</>;
};
