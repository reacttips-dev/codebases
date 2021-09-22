import { isRequiredFieldsBlockingModalFeatureEnabled, getComponentLoader, getLogger } from '../shared/api/webapp';

interface ValidateRequiredFieldsParams {
	deal: Pipedrive.Deal;
	dealUpdateProperties: Partial<Pipedrive.Deal>;
	updateDealOnSave?: boolean;
	onSave: (updatedProperties: Partial<Pipedrive.Deal>) => void;
	onError: (updatedProperties: Partial<Pipedrive.Deal>) => void;
	onCancel: () => void;
}

export default function ({
	deal,
	dealUpdateProperties,
	updateDealOnSave = false,
	onSave,
	onError,
	onCancel,
}: ValidateRequiredFieldsParams) {
	if (!isRequiredFieldsBlockingModalFeatureEnabled()) {
		onSave({});

		return;
	}

	getComponentLoader()
		.load('required-fields')
		.then((validateRequiredFields) => {
			validateRequiredFields({
				deal,
				dealUpdateProperties,
				updateDealOnSave,
				onSave,
				onError,
				onCancel,
			});
		})
		.catch((error) => {
			getLogger().error('Unable to load Required Fields service', error);
			// We will not block the deal update in case the Required Fields service is down
			onSave({});
		});
}
