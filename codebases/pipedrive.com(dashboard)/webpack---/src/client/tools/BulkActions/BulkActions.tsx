import React from 'react';

import { useRootSelector } from './store';
import { DeleteButton } from './components/DeleteButton';
import { ConfirmDeleteDialog } from './components/ConfirmDeleteDialog';
import { BulkEditSidebar } from './components/BulkEdit/BulkEditSidebar';
import { Progressbar } from './components/Progressbar';

export function BulkActions() {
	const showProgressbar = useRootSelector((s) => s.showProgressbar);
	const sidebarMounted = useRootSelector((s) => s.sidebarMounted);
	const showSidebar = useRootSelector((s) => s.showSidebar);
	const canBulkDelete = useRootSelector((s) => s.canBulkDelete);

	return (
		<>
			{sidebarMounted && <BulkEditSidebar />}
			{showProgressbar && <Progressbar />}
			{canBulkDelete && showSidebar && (
				<>
					<DeleteButton />
					<ConfirmDeleteDialog />
				</>
			)}
		</>
	);
}
