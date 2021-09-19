import { combineReducers } from 'redux';

import addReview from './addReview';
import reviewGallery from './reviewGallery';

const reviews = combineReducers({
  addReview,
  reviewGallery
});

export default reviews;
