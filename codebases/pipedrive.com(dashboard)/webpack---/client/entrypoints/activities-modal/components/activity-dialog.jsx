import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ActivityForm from './dialog-favors/activity-form';
import ActivityModal from './dialog-favors/activity-modal';
import ActivitySnackbar from './activity-snackbar';
import modalContext from '../../../utils/context';

const ActivityDialog = ({ isFlowView, isContextualView, autoFocus, modalMounted, closeModal, onMounted, onSave }) => {
	if (!modalMounted) {
		return <ActivitySnackbar key="snack" />;
	}

	const isModal = !isFlowView && !isContextualView;

	return (
		<>
			<ActivitySnackbar key="snack" />
			{isModal ? (
				<ActivityModal closeModal={closeModal} onMounted={onMounted} onSave={onSave} />
			) : (
				<ActivityForm closeModal={closeModal} autoFocus={autoFocus} />
			)}
		</>
	);
};

ActivityDialog.propTypes = {
	isFlowView: PropTypes.bool,
	isContextualView: PropTypes.bool,
	autoFocus: PropTypes.bool,
	closeModal: PropTypes.func,
	onMounted: PropTypes.func,
	onSave: PropTypes.func,

	modalMounted: PropTypes.bool,
};

const mapStateToProps = (store) => ({
	modalMounted: store.getIn(['modal', 'mounted']),
});

export default connect(mapStateToProps)(modalContext(ActivityDialog));
