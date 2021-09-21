import { useReducer, useEffect, useCallback } from 'react';
import { AnchorAPI } from '../../../../modules/AnchorAPI';
import {
  NewCuePoint,
  SavedCuePoint,
  SavedCuePoints,
  State,
  Action,
  SetPodcastEpisodeId,
  ValidationError,
} from './types';
import {
  LOADING,
  LOADING_FAILED,
  SAVING,
  SAVE_SUCCESS,
  SET_ERROR,
  SET_ERRORS,
  UPDATE_NEW_CUE_POINT,
  UPDATE_SAVED_CUE_POINTS,
  SET_PODCAST_EPISODE_ID,
  STATUS,
  DISMISS_ERROR_MODAL,
  REMOVING,
  REMOVE_SUCCESS,
  REMOVE_FAILED,
  CLEAR_ERROR,
  DURATION_ERROR_MESSAGE,
} from './constants';
import { getIsValidCuePoint, convertTimestampToMs } from './utils';
import { getFormattedTimestamp } from '../../../../modules/Time';
import { DEFAULT_VALUE } from './TimestampInput';

const intitialCuePoint: NewCuePoint = {
  startTime: null,
  startTimeString: DEFAULT_VALUE,
  adCount: 0,
  placementType: null,
};

const initialState = {
  podcastEpisodeId: null,
  newCuePoint: intitialCuePoint,
  status: STATUS.IDLE,
  isErrorModalDismissed: false,
};

function reducer(state: State, action: Action) {
  switch (action.type) {
    case LOADING:
      return { ...state, status: STATUS.IS_LOADING };
    case LOADING_FAILED:
      return { ...state, status: STATUS.LOADING_ERROR };
    case SAVING:
      return { ...state, status: STATUS.IS_SAVING };
    case SAVE_SUCCESS: {
      return {
        ...state,
        status: STATUS.SUCCESS,
        savedCuePoints: action.payload.savedCuePoints,
        newCuePoint: intitialCuePoint,
        errors: undefined,
      };
    }
    case REMOVING: {
      const { savedCuePoints } = state;
      const {
        payload: { cuePoint },
      } = action;
      let newSavedCuePoints: SavedCuePoints = [];
      if (savedCuePoints) {
        newSavedCuePoints = savedCuePoints.map(savedCuePoint => {
          const { startTimeString, isRemoving } = savedCuePoint;
          return {
            ...savedCuePoint,
            isRemoving:
              startTimeString === cuePoint.startTimeString ? true : isRemoving,
          };
        });
      }
      return {
        ...state,
        errors: undefined,
        savedCuePoints: newSavedCuePoints,
      };
    }
    case REMOVE_SUCCESS: {
      const { savedCuePoints } = state;
      const {
        payload: { cuePoint },
      } = action;
      let newSavedCuePoints: SavedCuePoints = [];
      if (savedCuePoints) {
        newSavedCuePoints = savedCuePoints.filter(
          savedCuePoint =>
            savedCuePoint.startTimeString !== cuePoint.startTimeString
        );
      }
      return {
        ...state,
        savedCuePoints: newSavedCuePoints,
      };
    }
    case REMOVE_FAILED: {
      const { savedCuePoints, errors } = state;
      const {
        payload: { cuePoint },
      } = action;
      let newSavedCuePoints: SavedCuePoints = [];
      if (savedCuePoints) {
        newSavedCuePoints = savedCuePoints.map(savedCuePoint => {
          const { startTimeString, isRemoving } = savedCuePoint;
          return {
            ...savedCuePoint,
            isRemoving:
              startTimeString === cuePoint.startTimeString ? false : isRemoving,
          };
        });
      }
      const newErrors = errors
        ? [...errors, action.payload.error]
        : [action.payload.error];
      const uniqueErrors = newErrors.filter(
        (err, ind) =>
          newErrors.findIndex(obj => obj.message === err.message) === ind
      );
      return {
        ...state,
        savedCuePoints: newSavedCuePoints,
        errors: uniqueErrors,
      };
    }
    case SET_ERROR: {
      const { errors } = state;
      const newErrors = errors
        ? [...errors, action.payload.error]
        : [action.payload.error];
      const uniqueErrors = newErrors.filter(
        (err, ind) =>
          newErrors.findIndex(obj => obj.message === err.message) === ind
      );
      return {
        ...state,
        status: STATUS.ERROR,
        errors: uniqueErrors,
        errorModal: action.payload.errorModal,
      };
    }
    case SET_ERRORS: {
      return {
        ...state,
        status: STATUS.ERROR,
        errors: action.payload.errors,
        errorModal: action.payload.errorModal,
      };
    }
    case CLEAR_ERROR: {
      const { payload } = action;
      const newIsErrorModalDismissed =
        payload !== undefined
          ? payload.isErrorModalDismissed !== undefined
            ? payload.isErrorModalDismissed
            : state.isErrorModalDismissed
          : state.isErrorModalDismissed;
      const newError = payload !== undefined ? payload.error : null;
      return {
        ...state,
        status: STATUS.IDLE,
        errors: state.errors
          ? newError
            ? state.errors.filter(err => err.message !== newError.message)
            : undefined
          : undefined,
        isErrorModalDismissed: newIsErrorModalDismissed,
      };
    }
    case DISMISS_ERROR_MODAL:
      return { ...state, errorModal: undefined, isErrorModalDismissed: true };
    case UPDATE_NEW_CUE_POINT:
      return { ...state, newCuePoint: action.payload.newCuePoint };
    case UPDATE_SAVED_CUE_POINTS:
      return { ...state, savedCuePoints: action.payload.savedCuePoints };
    case SET_PODCAST_EPISODE_ID:
      return { ...state, podcastEpisodeId: action.payload.podcastEpisodeId };
    default:
      return state;
  }
}

function useCuePoints({
  initialPodcastEpisodeId,
  setPodcastEpisodeId,
  mediaDuration,
}: {
  initialPodcastEpisodeId?: string;
  setPodcastEpisodeId: SetPodcastEpisodeId;
  mediaDuration?: number;
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    podcastEpisodeId: initialPodcastEpisodeId,
  });
  const {
    podcastEpisodeId,
    savedCuePoints,
    errors,
    isErrorModalDismissed,
  } = state;

  /**
   * Validates that timestamps are still within current episode duration
   */
  useEffect(() => {
    const isDurationErrorMessage =
      errors &&
      errors.findIndex(err => err.message === DURATION_ERROR_MESSAGE) !== -1;

    /**
     * assume that if the mediaDuration is set to `0` and the error message is
     * for the duration validation, the user removed the existing file.
     * we can then clear the error and set the `isErrorModalDismissed` back to
     * false so if they upload a new file, we show them the error modal again
     */
    if (mediaDuration === 0 && isDurationErrorMessage) {
      dispatch({
        type: CLEAR_ERROR,
        payload: { isErrorModalDismissed: false },
      });
    }

    /**
     * if mediaDuration is set (or greater than zero) and savedCuePoints defined
     * check that the cue points are within the duration
     */
    if (mediaDuration && savedCuePoints) {
      const isCuePointInvalid = savedCuePoints.some(
        ({ startTime }) => startTime > mediaDuration
      );

      // set error if we have invalid cue points and we haven't set the error yet
      if (isCuePointInvalid && !isDurationErrorMessage) {
        dispatch({
          type: SET_ERROR,
          payload: {
            error: { type: 'startTime', message: DURATION_ERROR_MESSAGE },
            // dont set the error modal if the user has already dismissed it
            errorModal: isErrorModalDismissed
              ? undefined
              : {
                  title: 'Please resolve any ad insertion errors.',
                  body: DURATION_ERROR_MESSAGE,
                },
          },
        });
      }

      /**
       * if the user removed all the invalid cue points and the current error
       * message is for the duration validation, clear the error message
       */
      if (!isCuePointInvalid && isDurationErrorMessage) {
        dispatch({ type: CLEAR_ERROR });
      }
    }
  }, [mediaDuration, savedCuePoints, isErrorModalDismissed, errors]);

  /**
   * If user is viewing an existing epsiode, set the episode ID into state
   * `initialPodcastEpisodeId` comes from the URL path
   */
  useEffect(() => {
    if (initialPodcastEpisodeId && !podcastEpisodeId) {
      dispatch({
        type: SET_PODCAST_EPISODE_ID,
        payload: { podcastEpisodeId: initialPodcastEpisodeId },
      });
    }
  }, [initialPodcastEpisodeId, podcastEpisodeId]);

  const fetchAdCuePoints = useCallback(() => {
    if (initialPodcastEpisodeId) {
      dispatch({ type: LOADING });
      AnchorAPI.fetchAdCuePoints({ episodeId: initialPodcastEpisodeId })
        .then(res => {
          const { episodeStreamingAdCuePoints } = res;
          const formattedCuePoints = episodeStreamingAdCuePoints.map(
            cuePoint => {
              const { adCount, startTime, placementType } = cuePoint;
              return {
                placementType,
                startTime,
                startTimeString: getFormattedTimestamp(startTime),
                adCount,
                isRemoving: false,
              };
            }
          );
          dispatch({
            type: SAVE_SUCCESS,
            payload: { savedCuePoints: formattedCuePoints },
          });
        })
        .catch(() => dispatch({ type: LOADING_FAILED }));
    }
  }, [initialPodcastEpisodeId]);

  /**
   * Fetch cue points if user is viewing an existing episode
   */
  useEffect(() => {
    if (savedCuePoints === undefined) {
      if (initialPodcastEpisodeId) {
        fetchAdCuePoints();
      } else {
        dispatch({
          type: SAVE_SUCCESS,
          payload: { savedCuePoints: [] },
        });
      }
    }
  }, [initialPodcastEpisodeId, savedCuePoints, fetchAdCuePoints]);

  function updateNewCuePoint(updatedCuePoint: NewCuePoint) {
    dispatch({
      type: UPDATE_NEW_CUE_POINT,
      payload: { newCuePoint: updatedCuePoint },
    });
  }

  function addCuePoint() {
    const { newCuePoint } = state;
    const currentCuePoints = savedCuePoints || [];
    const newError = getIsValidCuePoint(
      newCuePoint,
      currentCuePoints,
      mediaDuration
    );

    if (newError) {
      dispatch({
        type: SET_ERRORS,
        payload: {
          errors: newError,
        },
      });
    } else {
      dispatch({ type: SAVING });
      updateSavedCuePoints([
        ...currentCuePoints,
        {
          ...newCuePoint,
          startTime: convertTimestampToMs(newCuePoint.startTimeString!),
        } as SavedCuePoint,
      ])
        .then(updatedSavedCuePoints => {
          dispatch({
            type: SAVE_SUCCESS,
            payload: {
              savedCuePoints: updatedSavedCuePoints,
            },
          });
        })
        .catch(() =>
          dispatch({
            type: SET_ERROR,
            payload: {
              error: {
                type: 'form',
                message:
                  'We had some trouble saving your cue point, please try again.',
              },
            },
          })
        );
    }
  }

  function editCuePoint(
    newCuePoint: SavedCuePoint,
    originalCuePoint: SavedCuePoint
  ) {
    const { startTimeString } = originalCuePoint;
    const { isRemoving, ...rest } = newCuePoint; // remove the 'isRemoving' prop from cue point
    const editedNewCuePoint: SavedCuePoint = { ...rest, isRemoving: false };
    const currentCuePoints = savedCuePoints || [];
    // remove original cuePoint from the list of saved cue points
    const updatedCuePoints = currentCuePoints.filter(
      cp => cp.startTimeString !== startTimeString
    );

    const newError = getIsValidCuePoint(
      editedNewCuePoint,
      updatedCuePoints,
      mediaDuration
    );

    if (newError) {
      dispatch({
        type: SET_ERRORS,
        payload: {
          errors: newError,
        },
      });
    } else {
      dispatch({ type: SAVING });
      updateSavedCuePoints([
        ...updatedCuePoints,
        // we already updated the startTime from the input
        editedNewCuePoint,
      ])
        .then(updatedSavedCuePoints => {
          dispatch({
            type: SAVE_SUCCESS,
            payload: {
              savedCuePoints: updatedSavedCuePoints,
            },
          });
        })
        .catch(() =>
          dispatch({
            type: SET_ERROR,
            payload: {
              error: {
                type: 'form',
                message:
                  'We had some trouble saving your cue point, please try again.',
              },
            },
          })
        );
    }
  }

  function removeCuePoint(cuePoint: SavedCuePoint) {
    if (savedCuePoints) {
      dispatch({ type: REMOVING, payload: { cuePoint } });
      const { startTimeString } = cuePoint;
      const newSavedCuePoints = savedCuePoints.filter(
        cp => startTimeString !== cp.startTimeString
      );
      updateSavedCuePoints(newSavedCuePoints)
        .then(() => {
          dispatch({ type: REMOVE_SUCCESS, payload: { cuePoint } });
        })
        .catch(() => {
          dispatch({
            type: REMOVE_FAILED,
            payload: {
              cuePoint,
              error: {
                type: 'form',
                message:
                  'We had some trouble removing your cue point, please try again.',
              },
            },
          });
        });
    }
  }

  async function updateSavedCuePoints(
    updatedSavedCuePoints: SavedCuePoints
  ): Promise<SavedCuePoints> {
    try {
      let requestPodcastEpisodeId = podcastEpisodeId;

      // create episode if it hasn't been created yet
      if (!requestPodcastEpisodeId) {
        const {
          podcastEpisodeId: newPodcastEpisodeId,
        } = await AnchorAPI.createEpisode();

        // set the episode id for the parent form so when we save, it knows to
        // update an existing episode and not create a new one
        setPodcastEpisodeId(newPodcastEpisodeId);
        dispatch({
          type: SET_PODCAST_EPISODE_ID,
          payload: { podcastEpisodeId: newPodcastEpisodeId },
        });
        requestPodcastEpisodeId = newPodcastEpisodeId;
      }

      // save cue points
      const { status } = await AnchorAPI.saveAdCuePoints({
        episodeId: requestPodcastEpisodeId,
        cuePoints: updatedSavedCuePoints,
      });

      if (status === 'ok') {
        return updatedSavedCuePoints;
      }
      throw new Error('Unabled to save cue points');
    } catch (err) {
      throw new Error(err.message);
    }
  }

  function dismissErrorModal() {
    dispatch({ type: DISMISS_ERROR_MODAL });
  }

  function clearErrors(error?: ValidationError) {
    // clear all errors if no error has been passed in
    // otherwise only remove the error that's been passed in
    const payload = error
      ? {
          error,
        }
      : null;
    dispatch(payload ? { type: CLEAR_ERROR, payload } : { type: CLEAR_ERROR });
  }

  return {
    state,
    updateNewCuePoint,
    updateSavedCuePoints,
    addCuePoint,
    dismissErrorModal,
    removeCuePoint,
    fetchAdCuePoints,
    editCuePoint,
    clearErrors,
  };
}

export { useCuePoints };
