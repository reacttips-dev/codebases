const User = require('models/user');
const { checkMarketingStatusChangeRights } = require('views/shared/marketing-status-utils');
const EDITABILITY_FLAG_NAME = 'bulk_edit_allowed';
const isImmutableDealCloseTimeField = (fieldKey) => {
	return (
		(fieldKey === 'won_time' || fieldKey === 'lost_time') &&
		!User.settings.get('can_edit_deals_closed_date')
	);
};
const isEditableVisibilityField = (field) => {
	return field.field_type === 'visible_to' && User.settings.get('can_change_visibility_of_items');
};

const isEditableMarketingStatus = (model) => {
	const emails = model.get('email');

	if (!emails) {
		return;
	}

	const marketingStatus = model.get('marketing_status');

	return checkMarketingStatusChangeRights(emails, marketingStatus);
};

const isAllowedToEdit = (fieldKey, field, model) => {
	const immutableDealCloseTime = isImmutableDealCloseTimeField(fieldKey);
	const canEditVisibility = isEditableVisibilityField(field);

	const isMarketingStatusField = fieldKey === 'marketing_status';
	const canEditMarketingStatus = isEditableMarketingStatus(model);
	const isProductField = field.item_type === 'product';
	const canEditProducts = User.settings.get('can_edit_products');
	const isProductRelated = !isProductField || canEditProducts;
	const fieldIsEditable = field[EDITABILITY_FLAG_NAME];

	if (isMarketingStatusField && !canEditMarketingStatus) {
		return false;
	}

	return (isProductRelated && fieldIsEditable && !immutableDealCloseTime) || canEditVisibility;
};

const isEditableField = ({ columnKey, column, model }) => {
	if (!model) {
		return false;
	}

	const canBeEdited = User.fields.isEditable(column, model, EDITABILITY_FLAG_NAME);
	const allowedToEdit = isAllowedToEdit(columnKey, column, model);

	return canBeEdited && allowedToEdit;
};
const hasCustomEdit = ({ columnKey, modelType }) => {
	return columnKey === 'done' && modelType === 'activity';
};

module.exports = {
	isEditableField,
	hasCustomEdit
};
