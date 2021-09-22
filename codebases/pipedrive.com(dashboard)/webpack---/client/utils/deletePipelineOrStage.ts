import { Translator } from '@pipedrive/react-utils';

// eslint-disable-next-line complexity
export const getDeactivateEntitiesLabel = (numOfPlaybooks: number, numOfWebForms: number, translator: Translator) => {
	if (numOfWebForms === 0) {
		if (numOfPlaybooks === 0) {
			throw new Error('At least one playbook or one Web Form has to be deactivated');
		}
		if (numOfPlaybooks === 1) {
			return translator.gettext('Deactivate playbook');
		}
		if (numOfPlaybooks > 1) {
			return translator.gettext('Deactivate playbooks');
		}
	}
	if (numOfWebForms === 1) {
		if (numOfPlaybooks === 0) {
			return translator.gettext('Deactivate Web Form');
		}
		if (numOfPlaybooks === 1) {
			return translator.gettext('Deactivate playbook and Web Form');
		}
		if (numOfPlaybooks > 1) {
			return translator.gettext('Deactivate playbooks and Web Form');
		}
	}
	if (numOfWebForms > 1) {
		if (numOfPlaybooks === 0) {
			return translator.gettext('Deactivate Web Forms');
		}
		if (numOfPlaybooks === 1) {
			return translator.gettext('Deactivate playbook and Web Forms');
		}
		if (numOfPlaybooks > 1) {
			return translator.gettext('Deactivate playbooks and Web Forms');
		}
	}
};
