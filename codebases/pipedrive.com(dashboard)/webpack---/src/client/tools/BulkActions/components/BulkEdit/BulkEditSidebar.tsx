import { Button, Sidebar } from '@pipedrive/convention-ui-react';
import React, { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import styled, { createGlobalStyle } from 'styled-components';

import useTopSpace from '../../../../utils/useTopSpace';
import { store, useRootSelector } from '../../store';
import { submitForm, afterCloseSidebar } from '../../store/bulkEditSlice';
import { ApiContext } from '../../utils/ApiContext';
import { trackBulkEditCanceled } from '../../utils/bulkMetrics';
import { BulkEditForm } from './BulkEditForm';
import { useTranslations } from '../../utils/useTranslations';
import { ConfirmEditDialog } from './ConfirmEditDialog';
import { getUserFieldsByType } from '../../utils/fields';

const GlobalListStyle = createGlobalStyle`
	#pageContainer.listPage > .pageContent {
		right: 352px;
		transition-timing-function: cubic-bezier(.55,.09,.68,.53);
		transition-property: right;
		transition-duration: .25s;
	}
`;

const StyledButton = styled(Button)`
	width: 100%;
`;

export function BulkEditSidebar() {
	const { translator, user, bulkParams } = useContext(ApiContext);
	const dispatch = useDispatch();
	const criteria = useRootSelector((s) => s.criteria);
	const entityType = useRootSelector((s) => s.entityType);
	const selectedItemsCount = useRootSelector((s) => s.selectedItemsCount);
	const showConfirmationDialog = useRootSelector((s) => s.showConfirmationDialog);
	const showSidebar = useRootSelector((s) => s.showSidebar);
	const topOffset = useTopSpace();
	const [formState, setFormState] = useState({});
	const [modalVisible, setModalVisible] = useState(false);
	const [submitDisabled, setSubmitDisabled] = useState(true);
	const [visible, setVisible] = useState(false);
	const { editActionTextMap } = useTranslations();

	useEffect(() => {
		setVisible(showSidebar);
	}, [showSidebar]);

	if (!criteria) {
		return null;
	}

	const fields = getUserFieldsByType(user.fields, entityType);

	function handleClose() {
		if (showConfirmationDialog) {
			return;
		}

		trackBulkEditCanceled(formState, store.getState(), 'sidebar');
		setVisible(false);
		bulkParams.onClose?.();
	}

	function handleFormChange(formData: Record<string, unknown>) {
		setFormState(formData);
	}

	function handleFormValidChange(isValid) {
		setSubmitDisabled(!isValid);
	}

	function handleTransitionEnd(visible) {
		/* Needed for webapp list-view's scrollbar. Remove when that's deprecated in favour of new list-view. */
		window.dispatchEvent(new Event('resize'));

		if (!visible) {
			dispatch(afterCloseSidebar());
		}
	}

	async function handleSubmit() {
		setModalVisible(true);
		dispatch(submitForm());
	}

	const submitButton = (
		<StyledButton
			color="green"
			onClick={handleSubmit}
			disabled={submitDisabled}
			data-test="edit-sidebar-confirmation"
		>
			{editActionTextMap[entityType](selectedItemsCount)}
		</StyledButton>
	);

	return (
		<>
			{visible && <GlobalListStyle />}
			<Sidebar
				visible={visible}
				zIndex={17} /* below SA alert */
				topOffset={topOffset}
				title={translator.gettext('Bulk edit')}
				closeText={translator.gettext('Close')}
				footer={submitButton}
				onClose={handleClose}
				onTransitionEnd={handleTransitionEnd}
			>
				<BulkEditForm
					fields={fields}
					initialFormState={formState}
					onFormStateChange={handleFormChange}
					onFormValidChange={handleFormValidChange}
				/>
			</Sidebar>
			{modalVisible && <ConfirmEditDialog formState={formState} fields={fields} />}
		</>
	);
}
