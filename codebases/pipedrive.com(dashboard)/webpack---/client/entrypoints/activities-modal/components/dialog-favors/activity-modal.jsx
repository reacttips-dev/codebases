import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Modal } from '@pipedrive/convention-ui-react';

import modalContext from '../../../../utils/context';
import ActivityForm from './activity-form';
import { unMountModal } from '../../store/actions/modal';

const ActivityModal = ({ closeModal, translator, modalVisible, isEditing, unMountModal, onMounted, onSave }) => {
	const header = isEditing
		? translator.gettext('Edit activity')
		: translator.gettext('Schedule an activity');

	return (
		<Modal
			data-test="activity-modal"
			data-coachmark="activity-modal"
			backdrop
			visible={modalVisible}
			closeOnEsc
			header={header}
			onClose={() => closeModal()}
			onTransitionEnd={() => {
				if (!modalVisible) {
					unMountModal();
				}
			}}
			spacing="none"
			autoFocus
		>
			<ActivityForm closeModal={closeModal} onMounted={onMounted} onSave={onSave} />
		</Modal>
	);
};

ActivityModal.propTypes = {
	closeModal: PropTypes.func,
	translator: PropTypes.object.isRequired,
	modalVisible: PropTypes.bool,
	isEditing: PropTypes.bool,
	unMountModal: PropTypes.func,
	onMounted: PropTypes.func,
	onSave: PropTypes.func,
};

export default connect(
	(store) => ({
		modalVisible: store.getIn(['modal', 'visible']),
		isEditing: !!store.getIn(['form', 'activityId']),
	}),
	{
		unMountModal,
	},
)(modalContext(ActivityModal));
