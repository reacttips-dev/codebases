import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import RequestStateSnackbar from '../../../common-components/RequestStateSnackbar';
import activityCardContext from '../../../utils/context';
import {
	SAVE_RESULT_SUCCESS,
	SAVE_RESULT_ERROR,
	DELETE_RESULT_SUCCESS,
} from '../../../config/constants';

const CardSnackbar = ({ activityIsSaving, activitySaveResult, translator }) => {
	return (
		<RequestStateSnackbar
			isSaving={activityIsSaving}
			hasSavedSuccessfully={activitySaveResult === SAVE_RESULT_SUCCESS}
			hasDeletedSuccessfully={activitySaveResult === DELETE_RESULT_SUCCESS}
			hasError={activitySaveResult === SAVE_RESULT_ERROR}
			translator={translator}
		/>
	);
};

CardSnackbar.propTypes = {
	activityIsSaving: PropTypes.bool,
	activitySaveResult: PropTypes.string,
	translator: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
	return {
		activityIsSaving: state.getIn(['requestState', 'activityIsSaving']),
		activitySaveResult: state.getIn(['requestState', 'activitySaveResult']),
	};
};

export default connect(mapStateToProps)(activityCardContext(CardSnackbar));
