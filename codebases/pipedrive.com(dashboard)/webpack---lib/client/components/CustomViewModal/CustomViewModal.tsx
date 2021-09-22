import React, { useState } from 'react';
import { API } from '@pipedrive/types';
import { Input } from '@pipedrive/convention-ui-react';
import { useTranslator } from '@pipedrive/react-utils';
import { fieldsEquals } from 'Components/CustomViewModal/utils/comparators';

import * as S from './CustomViewModal.styles';
import { Field, CustomViewField, ModalStatus } from './types';
import { RevertDialog } from './RevertDialog';
import { Footer } from './Footer/Footer';
import { Body } from './Body/Body';
import { Header } from './Header/Header';
import { getAddedColumns, getRemovedColumns, resetCustomView, updateCustomView } from './utils/customViewApi';
import { useCustomViewHelper } from './utils/useCustomViewHelper';

type Tracking = {
	trackUsage: API['pdMetrics']['trackUsage'];
	view: 'deal_list_view' | 'leads_inbox';
	listViewType: 'deal' | 'lead';
};

type Props = {
	onSubmitFieldVisibilityOptions: (selectedFields: Field[]) => Promise<void> | void;
	onSelectDefaultCustomView: () => Promise<void> | void;
	customViewFields: CustomViewField[];
	entityFields: Partial<Record<string, Field[]>>;
	customViewId: number;
	areColumnsSavedWithFilter: boolean;
	onClose: () => void;
	portalTo: React.RefObject<HTMLDivElement>;
	tracking?: Tracking;
};

export const CustomViewModal = (props: Props) => {
	const translator = useTranslator();
	const [status, setStatus] = useState<ModalStatus>('IDLE');
	const [searchParam, setSearchParam] = useState('');
	const [isDialogVisible, setIsDialogVisible] = useState(false);
	const customViewHelper = useCustomViewHelper({
		entityFields: props.entityFields,
		customViewFields: props.customViewFields,
	});

	const isAnyActionDisabled = status !== 'IDLE';

	const confirmDefaultFilter = () => {
		setIsDialogVisible(true);
	};

	const handleSubmitVisibilityOptions = async () => {
		try {
			setStatus('RESET');
			await updateCustomView(props.customViewId, props.customViewFields, customViewHelper.selectedFields);
			setStatus('IDLE');
			props.onClose();
			await props.onSubmitFieldVisibilityOptions(customViewHelper.selectedFields);

			const tracking = props.tracking;
			if (tracking && !fieldsEquals(props.customViewFields, customViewHelper.selectedFields)) {
				const addedColumns = getAddedColumns(props.customViewFields, customViewHelper.selectedFields);

				const removedColumns = getRemovedColumns(props.customViewFields, customViewHelper.selectedFields);

				tracking.trackUsage(tracking.view, 'list_view_columns', 'updated', {
					list_view_type: tracking.listViewType,
					column_count: customViewHelper.selectedFields.length,
					columns_added: addedColumns,
					columns_added_count: addedColumns.length,
					columns_removed: removedColumns,
					columns_removed_count: removedColumns.length,
				});
			}
		} catch (err) {
			throw new Error(`Could not submit visibility options. Original error: ${err}`);
		}
	};

	const handleSelectDefaultCustomView = async () => {
		try {
			setIsDialogVisible(false);
			setStatus('RESET');
			await resetCustomView(props.customViewId);

			setStatus('IDLE');
			props.onClose();

			await props.onSelectDefaultCustomView();

			const tracking = props.tracking;
			if (tracking) {
				tracking.trackUsage(tracking.view, 'list_view_columns', 'reset_to_default', {
					list_view_type: tracking.listViewType,
				});
			}
		} catch (e) {
			//
		}
	};

	return (
		<>
			<S.PopoverRoot
				// Prevent the modal to close when clicking on the checkboxes
				onClick={(evt) => evt.stopPropagation()}
				visible
				placement="bottom-end"
				portalTo={props.portalTo.current ?? undefined}
				onVisibilityChange={(value) => {
					// We don't want to close the modal if clicking elsewhere
					// why the UI is blocked by the confirmation dialog
					if (isDialogVisible) {
						return;
					}

					props.onClose();
				}}
				content={
					<S.PopoverContent>
						<Header>
							<Input
								defaultValue={searchParam}
								value={searchParam}
								icon="ac-search"
								placeholder={translator.gettext('Search')}
								disabled={isAnyActionDisabled}
								autoFocus
								allowClear
								onChange={(e) => setSearchParam(e.target.value)}
							/>
						</Header>

						<Body searchParam={searchParam} modalStatus={status} customViewHelper={customViewHelper} />

						<Footer
							modalStatus={status}
							onSaveClick={handleSubmitVisibilityOptions}
							onCloseClick={props.onClose}
							onDefaultClick={confirmDefaultFilter}
							isSaveButtonDisabled={isAnyActionDisabled || customViewHelper.selectedFields.length === 0}
							areColumnsSavedWithFilter={props.areColumnsSavedWithFilter}
						/>
					</S.PopoverContent>
				}
			>
				{/**
				 * DOM Element is necessary to be placed here
				 * otherwise, the popover won't be rendered
				 * */}
				<span />
			</S.PopoverRoot>

			<RevertDialog
				onRevertClick={handleSelectDefaultCustomView}
				isVisible={isDialogVisible}
				onClose={() => setIsDialogVisible(false)}
			/>
		</>
	);
};
