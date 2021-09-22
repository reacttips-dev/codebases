import { Modal } from '@pipedrive/convention-ui-react';
import { FormFieldsContext } from '@pipedrive/form-fields';
import TranslatorClient from '@pipedrive/translator-client';
import { getOrgFieldKey, getPersonFieldKey } from 'components/Fields/Fields.utils';
import LeftPanel from 'components/Panels/LeftPanel';
import RightPanel from 'components/Panels/RightPanel';
import Snackbar from 'components/Snackbar/Snackbar';
import { CappingError } from 'components/Capping/CappingError';
import { useAsyncData } from 'hooks/useAsyncData';
import { useMount } from 'hooks/useMount';
import { useRequiredFields } from 'hooks/useRequiredFields';
import { noop } from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import createModalErrors from 'utils/createModalErrors';
import getLoadingHeight from 'utils/getLoadingHeight';
import getLogger from 'utils/logger';
import { getFeatures, getWebappApiValues } from 'utils/webappApiParser';
import {
	DuplicateType,
	ModalErrors,
	ModalProps,
	ModalState,
	ModalUpdateState,
	RelatedEntityState,
	RelatedEntityType,
	ShowFields,
	SnackbarConfig,
} from 'Types/types';

import { ModalContext } from './AddModal.context';
import { hasNoErrors, removeErrorFromState } from './AddModal.error';
import { Footer } from './AddModal.footer';
import { getInitialRelatedEntityState, getInitialState } from './AddModal.initialState.utils';
import { trackModalClose, trackModalOpen, trackSaved } from './AddModal.metrics';
import styles from './AddModal.pcss';
import { saveModal } from './AddModal.save';
import {
	getModalConfig,
	getUpdateModalState,
	getUpdateRelatedEntityState,
	openDetailsPageIfNeeded,
	sendSocketMessage,
} from './AddModal.utils';
import { CappingDialog } from 'components/Capping/CappingDialog';

// eslint-disable-next-line complexity
export const AddModal = ({
	componentLoader,
	userSelf,
	companyUsers,
	params,
	translator,
	ffTranslatorClient,
	pdMetrics,
	router,
	socketHandler,
	ffContextData,
}: ModalProps) => {
	const {
		modalType,
		onsave,
		onSave,
		metrics_data,
		metricsData,
		prefill = {},
		prefillRelatedEntities,
		prefillContacts,
		showFields = { organization: [], person: [], deal: [], lead: [] } as ShowFields,
		title,
		skipOpenDetails,
		onAfterClose,
		onMounted,
		source,
	} = params;

	/**
	 * To support both old and new APIs. The old one has inconsistent namings...
	 */
	const customMetricsData = metrics_data || metricsData;
	const onSaveCallback = onsave || onSave;

	const modalConfig = getModalConfig(modalType, translator);

	if (title) {
		modalConfig.title = title;
	}

	const [isLoading, rawRequiredFields, relatedEntityFields, leadLabels, usageCaps, usageCapsMapping] = useAsyncData(
		modalType,
		getFeatures(userSelf),
		showFields,
		userSelf,
	);

	const logger = getLogger(userSelf, modalType);
	const parsedWebappApi = useMemo(
		() => getWebappApiValues(userSelf, companyUsers, componentLoader, router, modalType, showFields, modalConfig),
		[leadLabels],
	);

	const {
		countryCode,
		language,
		features,
		settings,
		fields,
		currencies,
		users,
		pipelines,
		stages,
		isAccountSettingsEnabled,
		isReseller,
		...restParsedAPI
	} = parsedWebappApi;

	const requiredFields = useRequiredFields(
		logger,
		fields[modalType].visibleFields,
		relatedEntityFields,
		rawRequiredFields,
	);

	const [relatedEntityState, setRelatedEntityState] = useState<RelatedEntityState>(() =>
		getInitialRelatedEntityState(prefillRelatedEntities || prefillContacts, fields, parsedWebappApi),
	);

	const [isVisible, isMounted, setVisible, setMounted] = useMount(isLoading, onAfterClose, onMounted);
	const [snackbar, setSnackbar] = useState<SnackbarConfig | null>(null);

	const [modalState, setModalState] = useState<ModalState>(() =>
		getInitialState(settings, prefill, fields, modalType, modalConfig, translator, parsedWebappApi),
	);

	const [isAddingProducts, setIsAddingProducts] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [errors, setErrors] = useState<ModalErrors>(createModalErrors({}));
	const [duplicates, setDuplicates] = useState<DuplicateType[]>([]);
	const [duplicateKeyToShow, setActiveDuplicateBlock] = useState('');
	const [isAutomaticallyOpeningDuplicateChecker, setAutomaticallyOpeningDuplicateChecker] = useState(
		settings.showDuplicates,
	);
	const [cappingError, setCappingError] = useState(false);

	useEffect(() => trackModalOpen(customMetricsData, modalType, pdMetrics, prefill), []);

	const onUpdateState = (value: ModalUpdateState) => {
		setErrors(removeErrorFromState(value, modalType));
		setModalState(getUpdateModalState(value, modalType, translator));
	};

	const onPipelineStageUpdate = (values: ModalState) => {
		setErrors((errors: ModalErrors) => ({ ...errors, deal: {} }));
		setModalState({ ...modalState, ...values });
	};

	const onUpdateRelatedEntityState = (value: ModalUpdateState, relatedEntityType: RelatedEntityType) => {
		setErrors(removeErrorFromState(value, relatedEntityType));

		setRelatedEntityState((prevState) => getUpdateRelatedEntityState(prevState, relatedEntityType, value));
	};

	const onResetRelatedEntityState = (fieldKey: string) => {
		if (modalType === 'deal') {
			setErrors({ ...errors, person: {}, organization: {} });
		} else if (modalType === 'lead') {
			setErrors({ ...errors, person: {}, organization: {} });
		} else if (modalType === 'person') {
			setErrors({ ...errors, organization: {} });
		}

		const personFieldKey = getPersonFieldKey(modalType);

		if (fieldKey === personFieldKey) {
			setRelatedEntityState((prevState) => {
				const tmp = {
					...prevState,
					person: {},
				};

				return tmp;
			});
		}

		const orgFieldKey = getOrgFieldKey(modalType);

		if (fieldKey === orgFieldKey) {
			setRelatedEntityState((prevState) => ({
				...prevState,
				organization: {},
			}));
		}
	};

	const closeModal = () => {
		trackModalClose(customMetricsData, modalType, pdMetrics);
		setVisible(false);
	};

	const createAndClose = async () => {
		const errorsList = modalConfig.getErrorsReference({
			state: modalState,
			relatedEntityState,
			requiredFields: requiredFields || {},
			fields,
			translator,
		});

		if (!hasNoErrors(errorsList)) {
			logger.info('Adding deal errors', errorsList);

			return setErrors(errorsList);
		}

		setIsSaving(true);

		try {
			const response = await saveModal(modalType, modalState, relatedEntityState, fields, source);

			if (onSaveCallback) {
				await onSaveCallback(response);
			}

			trackSaved(
				response,
				modalType,
				customMetricsData,
				pdMetrics,
				prefill,
				modalState,
				relatedEntityState,
				features.requiredFields ? requiredFields : null,
			);

			if (!skipOpenDetails) {
				openDetailsPageIfNeeded(response.data.id, modalConfig, userSelf, router);
			}

			sendSocketMessage(modalType, socketHandler, response);

			// In the old nav there are those snackbars already provided by the quick-add-shortcuts
			// and it would create double snackbars.
			// @ts-ignore
			// eslint-disable-next-line
			setSnackbar({
				message: modalConfig.createSnackbarMessage(response.data),
				href: modalConfig.createDetailsUrl(String(response.data.id)),
				onDismiss: () => {
					setMounted(false);
				},
			});

			setVisible(false);
			setCappingError(false);
		} catch (error) {
			if (features.dealsUsageCapping) {
				(error as { code: string }).code === 'feature_capping_deals_limit' && setCappingError(true);
			}

			setIsSaving(false);
			logger.error('Error creating item', error as Error);
			setSnackbar({
				message: translator.gettext('An error has occurred. Please try again later.'),
				onDismiss: noop,
			});
		}
	};

	const onTransitionEnd = () => {
		if (!isVisible && !snackbar) {
			setMounted(false);
		}
	};

	if (!isMounted || !translator) {
		return null;
	}

	if (
		modalType === 'deal' && features.dealsUsageCapping &&
		(Object.keys(usageCaps).length === 0 || Object.keys(usageCapsMapping).length === 0)
	) {
		return null;
	}

	const showDealsUpsellDialog =
		features.dealsUsageCapping &&
		modalType === 'deal' &&
		usageCaps.usage &&
		usageCaps.cap &&
		usageCaps.isCapped &&
		usageCaps.usage >= usageCaps.cap;

	return (
		<ModalContext.Provider
			value={{
				translator,
				params,
				errors,
				onUpdateState,
				onPipelineStageUpdate,
				onUpdateRelatedEntityState,
				onResetRelatedEntityState,
				setRelatedEntityState,
				relatedEntityFields,
				modalType,
				modalState,
				relatedEntityState,
				modalConfig,
				features,
				duplicates,
				setDuplicates,
				setActiveDuplicateBlock,
				duplicateKeyToShow,
				isAutomaticallyOpeningDuplicateChecker,
				setAutomaticallyOpeningDuplicateChecker,
				isAddingProducts,
				setIsAddingProducts,
				prefill,
				settings,
				logger,
				fields,
				currencies,
				users,
				requiredFields,
				userSelf,
				pdMetrics,
				pipelines,
				stages,
				...restParsedAPI,
			}}
		>
			<FormFieldsContext.Provider
				value={{
					translator: ffTranslatorClient as TranslatorClient,
					webappApi: {
						componentLoader,
						userSelf,
						companyUsers,
					},
					pipelines,
					stages,
					ffContextData,
					currencies,
				}}
			>
				{showDealsUpsellDialog ? (
					<CappingDialog
						usageCapsMapping={usageCapsMapping}
						isAccountSettingsEnabled={isAccountSettingsEnabled}
						isReseller={isReseller}
					/>
				) : (
					<Modal
						loading={isLoading}
						loadingHeight={isLoading ? getLoadingHeight(fields, modalType, features) : undefined}
						autoFocus={true}
						data-test="add-modal"
						visible={isVisible}
						closeOnEsc
						header={modalConfig.title}
						spacing={{
							all: 'none',
						}}
						footer={
							<Footer
								modalType={modalType}
								isSavingDisabled={!hasNoErrors(errors) || isSaving || cappingError}
								isSaving={isSaving}
								onClose={closeModal}
								onSave={createAndClose}
								usageCaps={usageCaps}
								usageCapsMapping={usageCapsMapping}
								isAccountSettingsEnabled={isAccountSettingsEnabled}
								isReseller={isReseller}
								cappingError={cappingError}
							/>
						}
						onClose={closeModal}
						onTransitionEnd={onTransitionEnd}
					>
						<React.Fragment>
							{cappingError && (
								<CappingError
									isAccountSettingsEnabled={isAccountSettingsEnabled}
									usageCapsMapping={usageCapsMapping}
								/>
							)}
							<div className={styles.panelsWrapper}>
								<LeftPanel modalType={modalType} />

								<RightPanel relatedEntityFields={relatedEntityFields} />
							</div>
						</React.Fragment>
					</Modal>
				)}

				<Snackbar {...snackbar} />
			</FormFieldsContext.Provider>
		</ModalContext.Provider>
	);
};
