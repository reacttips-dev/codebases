'use es6';

import { connect } from 'react-redux';
import { updateCSaTFeedbackRating } from '../actions/csatFeedbackActions';
import CSaTFeedbackStarRating from '../components/CSaTFeedbackStarRating';
var mapDispatchToProps = {
  onChange: updateCSaTFeedbackRating
};
var ConnectedCSaTFeedbackStarRating = connect(null, mapDispatchToProps)(CSaTFeedbackStarRating);
ConnectedCSaTFeedbackStarRating.displayName = 'ConnectedCSaTFeedbackStarRating';
export default ConnectedCSaTFeedbackStarRating;