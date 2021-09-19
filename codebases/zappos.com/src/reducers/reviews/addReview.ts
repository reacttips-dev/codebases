import {
  ADD_REVIEW_FORM_VALIDATION,
  RECEIVE_SUBMIT_ADD_REVIEW,
  REQUEST_SUBMIT_ADD_REVIEW,
  RESET_ADD_REVIEW,
  UPDATE_ADD_REVIEW_ABOUT,
  UPDATE_ADD_REVIEW_FIT,
  UPDATE_ADD_REVIEW_RATING,
  UPDATE_ADD_REVIEW_SUMMARY
} from 'constants/reduxActions';
import { AppAction } from 'types/app';

export interface AddReviewState {
  summary: string;
  overallRating: string;
  comfortRating: string;
  lookRating: string;
  shoeSize: string;
  shoeWidth: string;
  shoeArch: string;
  reviewerName: string;
  reviewerLocation: string;
  otherShoes: string;
  isSubmitted: boolean;
  isLoading: boolean;
  errorMap: Record<string, boolean>;
  attemptedToSubmit?: boolean;
  submitReviewErrorMessage?: string;
  colorId?: string;
}

const initialState: AddReviewState = {
  summary: '',
  overallRating: '0',
  comfortRating: '0',
  lookRating: '0',
  shoeSize: 'TRUE_TO_SIZE',
  shoeWidth: 'TRUE',
  shoeArch: 'MODERATE',
  reviewerName: '',
  reviewerLocation: '',
  otherShoes: '',
  isSubmitted: false,
  isLoading: false,
  errorMap: {}
};

const addReview = (state: Readonly<AddReviewState> = initialState, action: AppAction): AddReviewState => {

  switch (action.type) {
    case ADD_REVIEW_FORM_VALIDATION: {
      const { errorMap } = action;
      return { ...state, errorMap };
    }
    case UPDATE_ADD_REVIEW_SUMMARY: {
      const { summary } = action;
      return { ...state, summary };
    }
    case UPDATE_ADD_REVIEW_RATING: {
      const { rating } = action;
      return { ...state, [rating.name]: rating.value };
    }
    case UPDATE_ADD_REVIEW_FIT: {
      const { fit } = action;
      return { ...state, [fit.name]: fit.value };
    }
    case UPDATE_ADD_REVIEW_ABOUT: {
      const { about } = action;
      return { ...state, [about.name]: about.value };
    }
    case REQUEST_SUBMIT_ADD_REVIEW: {
      return { ...state, isLoading: true, attemptedToSubmit: true };
    }
    case RECEIVE_SUBMIT_ADD_REVIEW: {
      const nextState: AddReviewState = { ...state, isSubmitted: true, isLoading: false };
      return nextState;
    }
    case RESET_ADD_REVIEW: {
      return initialState;
    }
    default:
      return state;
  }
};

export default addReview;
