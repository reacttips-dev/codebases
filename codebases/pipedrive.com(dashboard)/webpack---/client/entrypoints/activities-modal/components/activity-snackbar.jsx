import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import {
	SAVE_RESULT_ERROR,
	SAVE_RESULT_SUCCESS,
	DELETE_RESULT_SUCCESS,
} from '../../../config/constants';
import { showModal as showModalAction } from '../store/actions/modal';

import modalContext from '../../../utils/context';
import RequestStateSnackbar from '../../../common-components/RequestStateSnackbar';

const ActivitySnackbar = ({ activityIsSaving, activitySaveResult, showModal, translator }) => {
	return (
		<RequestStateSnackbar
			isSaving={activityIsSaving}
			hasSavedSuccessfully={activitySaveResult === SAVE_RESULT_SUCCESS}
			hasDeletedSuccessfully={activitySaveResult === DELETE_RESULT_SUCCESS}
			hasError={activitySaveResult === SAVE_RESULT_ERROR}
			onError={showModal}
			translator={translator}
		/>
	);
};

ActivitySnackbar.propTypes = {
	activityIsSaving: PropTypes.bool,
	activitySaveResult: PropTypes.string,
	showModal: PropTypes.func,
	translator: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	return {
		activityIsSaving: state.getIn(['requestState', 'activityIsSaving']),
		activitySaveResult: state.getIn(['requestState', 'activitySaveResult']),
	};
};

const mapDispatchToProps = (dispatch) => ({
	showModal: () => dispatch(showModalAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(modalContext(ActivitySnackbar));
