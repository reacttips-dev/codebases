const _ = require('lodash');
const modelUtils = require('views/grid-react/utils/model-utils');
const { checkMarketingStatusChangeRights } = require('views/shared/marketing-status-utils');
const Field = require('models/field');
const LabelDropmenu = require('components/labels-management/label-dropmenu');
const AddToDealModal = require('../../../views/shared/add-product-deal-modal');
const componentLoader = require('webapp-component-loader');
const isDealValueWithProducts = ({ model, modelType, columnKey }) => {
	const isDealValueField = modelType === 'deal' && columnKey === 'value';
	const hasProducts = !!modelUtils.getModelAttribute(model, 'products_count', null);

	return isDealValueField && hasProducts;
};

const openProductDialog = ({ model }) => {
	const personId = model.get('person_id');
	const organizationId = model.get('org_id');
	const relatedPerson = model.getRelatedObjects().person;
	const relatedOrganization = model.getRelatedObjects().organization;

	if (personId && relatedPerson && relatedPerson[personId]) {
		model.set({
			person_name: relatedPerson[personId].name
		});
	}

	if (organizationId && relatedOrganization && relatedOrganization[organizationId]) {
		model.set({
			org_name: relatedOrganization[organizationId].name
		});
	}

	return AddToDealModal.openProductDealModal(model);
};
const openFieldEditModal = async ({ model, column, columnKey, event }) => {
	const target = event.currentTarget;
	const popover = await componentLoader.load('webapp:popover');

	popover.open({
		popover: 'changefieldvalue',
		params: {
			model,
			title: _.gettext('Edit ') + column.name,
			fieldKey: columnKey,
			position: 'bottom-start',
			offset: 11,
			target,
			popperOptions: {
				preventOverflow: {
					boundariesElement: 'viewport'
				}
			}
		}
	});
};

const openMarketingStatusEditModal = async ({ model, event, onClose }) => {
	const target = event.currentTarget;
	const popover = await componentLoader.load('webapp:popover');

	popover.open({
		popover: 'person/marketing-status-select',
		params: {
			model,
			target,
			position: 'bottom-start',
			value: model.get('marketing_status'),
			offset: 11,
			popperOptions: {
				preventOverflow: {
					enabled: true,
					boundariesElement: 'viewport'
				}
			},
			onClose
		}
	});
};

const handleFieldEdit = (props, event, whenDone = _.noop) => {
	const { model, modelType, column, columnKey, popoverContainerRef, scrollContainerRef } = props;
	const dealValueWithProducts = isDealValueWithProducts({ model, modelType, columnKey });
	const LABEL_KEY = 'label';
	const MARKETING_STATUS_KEY = 'marketing_status';

	if (column.key === LABEL_KEY) {
		return new LabelDropmenu({
			el: popoverContainerRef,
			scrollContainerRef,
			fieldKey: LABEL_KEY,
			fieldModel: new Field(column, { type: model.type }),
			entityModel: model,
			isButtonVisible: false,
			onClose: () => whenDone()
		});
	} else if (column.key === MARKETING_STATUS_KEY) {
		const emails = model.get('email');
		const canChangeMarketingStatus = checkMarketingStatusChangeRights(
			emails,
			model.get('marketing_status')
		);

		if (canChangeMarketingStatus) {
			openMarketingStatusEditModal({ model, event, onClose: () => whenDone() });
			app.global.bindOnce('ui.popover.event.close', whenDone);
		} else {
			whenDone();
		}

		return;
	}

	if (dealValueWithProducts) {
		openProductDialog({ model });
		whenDone();
	} else {
		openFieldEditModal({ model, column, columnKey, event });
		app.global.bindOnce('ui.popover.event.close', whenDone);
	}
};

export { handleFieldEdit };
