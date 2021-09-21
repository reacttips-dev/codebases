import { useReducer, useEffect, useRef, useCallback } from 'react';
import { AnchorAPI } from '../../../../modules/AnchorAPI';
import {
  FetchSpeechSynthesisTaskResponse,
  VoiceId,
} from '../../../../modules/AnchorAPI/v3/episodes';
import { poll } from '../../../../modules/Poll';
import { WORDPRESS_POST_ERRORS } from '../../../../modules/AnchorAPI/v3/wordpress';
import { TextToSpeechProps } from '.';
import { useFeatureFlagsCtx } from '../../../../contexts/FeatureFlags';
import { FEATURE_FLAGS } from '../../../../modules/FeatureFlags';
import { AudioFile } from '../../../../modules/AnchorAPI/v3/episodes/fetchSpeechSynthesisTask';

const SET_VOICE_OPTION = 'SET_VOICE_OPTION';
const CHECK_CONVERSION_TASK_STATUS = 'CHECK_CONVERSION_TASK_STATUS';
const CANCEL_CONVERSION_TASK = 'CANCEL_CONVERSION_TASK';
const FAIL_CONVERSION_TASK = 'FAIL_CONVERSION_TASK';
const COMPLETE_CONVERSION_TASK = 'COMPLETED_CONVERSION_TASK';
const RESTART = 'RESTART';

export enum TTS_VIEW {
  VOICE_SELECTION,
  CONVERTING,
  PREVIEW,
  ERROR,
}

/**
 * these values are different from the `WORDPRESS_POST_ERRORS` enum
 * `WORDPRESS_POST_ERRORS` are errors that are coming from the API, these
 * are just normal integers (starting from 0).
 *
 * These `CONVERSION_ERRORS` have specific error codes that we can show to the
 * user. This will help us identity which error a user is experiencing. So we map
 * equivalent `CONVERSION_ERRORS` to the `WORDPRESS_POST_ERRORS`
 */
export enum CONVERSION_ERRORS {
  VOICE_NOT_SELECTED = '89a7d0df',
  TASK_FAILED = '6b170c13',
  MISSING_AUDIO_OBJECT = 'f8dfa029',
  TASK_NOT_RETURNED = '57788d55',
  TTS_DISABLED = 'c2a1934b',
  USER_ID_OR_WEB_STATION_ID_MISSING = '135e9ec8',
  CONTENT_TOO_LONG = 'cb5f330a',
  RATE_LIMITED = 'fb4bbb14',
}

export type TTS_ERROR = CONVERSION_ERRORS | string;

type TextConversionState = {
  view: TTS_VIEW;
  ttsAudio: AudioFile | null;
  error: TTS_ERROR | null;
  voiceId: VoiceId | null;
};

const initialState: TextConversionState = {
  view: TTS_VIEW.VOICE_SELECTION,
  ttsAudio: null,
  error: null,
  voiceId: null,
};

type TextConversionAction =
  | {
      type: typeof SET_VOICE_OPTION;
      payload: { voiceId: VoiceId };
    }
  | {
      type: typeof CHECK_CONVERSION_TASK_STATUS;
    }
  | {
      type: typeof CANCEL_CONVERSION_TASK;
    }
  | {
      type: typeof FAIL_CONVERSION_TASK;
      payload: { error: TTS_ERROR };
    }
  | {
      type: typeof COMPLETE_CONVERSION_TASK;
      payload: { ttsAudio: AudioFile };
    }
  | { type: typeof RESTART };

function textConversionReducer(
  state: TextConversionState,
  action: TextConversionAction
) {
  switch (action.type) {
    case SET_VOICE_OPTION:
      return { ...state, voiceId: action.payload.voiceId };
    case CHECK_CONVERSION_TASK_STATUS:
      return { ...state, view: TTS_VIEW.CONVERTING };
    case CANCEL_CONVERSION_TASK:
      return { ...state, view: TTS_VIEW.VOICE_SELECTION };
    case COMPLETE_CONVERSION_TASK:
      return {
        ...state,
        view: TTS_VIEW.PREVIEW,
        ttsAudio: action.payload.ttsAudio,
      };
    case FAIL_CONVERSION_TASK:
      return { ...state, view: TTS_VIEW.ERROR, error: action.payload.error };
    case RESTART:
      return initialState;
    default:
      return state;
  }
}

export function useTextConversion({
  webStationId,
  userId,
  webEpisodeId,
  wordPressPostErrors,
}: {
  wordPressPostErrors: WORDPRESS_POST_ERRORS[];
  userId: number | null;
  webStationId: string | null;
} & Pick<TextToSpeechProps, 'webEpisodeId'>): [
  TextConversionState,
  {
    setVoiceId: (voiceId: VoiceId) => void;
    startConversion: () => void;
    cancelConversion: () => void;
    restart: () => void;
  }
] {
  const {
    state: { featureFlags },
  } = useFeatureFlagsCtx();
  const [state, dispatch] = useReducer(textConversionReducer, initialState);
  const { voiceId } = state;
  const pollRef = useRef<() => void>();
  const createTaskAbortControllerRef = useRef<AbortController | null>(null);
  const fetchTaskAbortControllerRef = useRef<AbortController | null>(null);

  const getIsTTSDisabled = useCallback(
    () =>
      featureFlags &&
      !featureFlags.includes(
        FEATURE_FLAGS.WORDPRESS_CONVERT_TEXT_TO_AUDIO_ENABLED
      ),
    [featureFlags]
  );

  const getIsContentTooLong = useCallback(
    () =>
      wordPressPostErrors.length > 0 &&
      wordPressPostErrors.includes(WORDPRESS_POST_ERRORS.CONTENT_TOO_LONG),
    [wordPressPostErrors]
  );

  useEffect(() => {
    if (getIsTTSDisabled()) {
      handleTaskFailed(CONVERSION_ERRORS.TTS_DISABLED);
    }
  }, [getIsTTSDisabled]);

  useEffect(() => {
    if (getIsContentTooLong()) {
      handleTaskFailed(CONVERSION_ERRORS.CONTENT_TOO_LONG);
    }
  }, [getIsContentTooLong]);

  function createNewTask() {
    if (voiceId === null) {
      handleTaskFailed(CONVERSION_ERRORS.VOICE_NOT_SELECTED);
    } else if (!userId || !webStationId) {
      handleTaskFailed(CONVERSION_ERRORS.USER_ID_OR_WEB_STATION_ID_MISSING);
    } else {
      const abortController = new AbortController();
      createTaskAbortControllerRef.current = abortController;
      AnchorAPI.createSpeechSynthesisTask({
        webStationId,
        userId,
        webEpisodeId,
        voiceId,
        signal: abortController.signal,
      })
        .then(() => {
          pollTaskStatus();
        })
        .catch(handleSpeechRequestError);
    }
  }

  /**
   * stop any polling/requests in progress if the component unmounts
   */
  useEffect(
    () => () => {
      handleCleanUpTasks();
    },
    []
  );

  function handleCompleteTask(ttsAudio: AudioFile) {
    dispatch({ type: COMPLETE_CONVERSION_TASK, payload: { ttsAudio } });
  }

  function pollTaskStatus() {
    const abortController = new AbortController();
    fetchTaskAbortControllerRef.current = abortController;
    const [
      response,
      stopPolling,
    ] = poll<FetchSpeechSynthesisTaskResponse | null>({
      maxAttempts: 200,
      interval: 3000,
      fn: () =>
        AnchorAPI.fetchSpeechSynthesisTask({
          webEpisodeId,
          signal: abortController.signal,
          webStationId: webStationId!,
          userId: userId!,
        }),
      validate: task => {
        if (task === null) return false;
        const { status } = task;
        switch (status) {
          case 'success':
          case 'failure':
            return true;
          case 'inProgress':
          default:
            return false;
        }
      },
    });
    pollRef.current = stopPolling;
    response
      .then(task => {
        if (task) {
          const { status, audio } = task;
          if (status === 'failure') {
            handleTaskFailed(CONVERSION_ERRORS.TASK_FAILED);
          } else if (audio === null) {
            handleTaskFailed(CONVERSION_ERRORS.MISSING_AUDIO_OBJECT);
          } else {
            handleCompleteTask(audio);
          }
        } else {
          handleTaskFailed(CONVERSION_ERRORS.TASK_NOT_RETURNED);
        }
      })
      .catch(handleSpeechRequestError);
  }

  function handleSpeechRequestError(err: Error) {
    if (err.message !== 'The user aborted a request.') {
      handleTaskFailed(err.message);
    }
  }

  function handleTaskFailed(error: TTS_ERROR) {
    dispatch({
      type: FAIL_CONVERSION_TASK,
      payload: { error },
    });
  }

  function startConversion() {
    if (getIsTTSDisabled()) {
      handleTaskFailed(CONVERSION_ERRORS.TTS_DISABLED);
    } else if (getIsContentTooLong()) {
      handleTaskFailed(CONVERSION_ERRORS.CONTENT_TOO_LONG);
    } else if (voiceId === null) {
      // cannot start conversion if a voice is not selected
      handleTaskFailed(CONVERSION_ERRORS.VOICE_NOT_SELECTED);
    } else if (!webStationId || !userId) {
      handleTaskFailed(CONVERSION_ERRORS.USER_ID_OR_WEB_STATION_ID_MISSING);
    } else {
      // check for previously converted audio
      dispatch({ type: CHECK_CONVERSION_TASK_STATUS });
      const abortController = new AbortController();
      fetchTaskAbortControllerRef.current = abortController;
      AnchorAPI.fetchSpeechSynthesisTask({
        webEpisodeId,
        signal: abortController.signal,
        webStationId,
        userId,
      })
        .then(task => {
          if (task === null) {
            // if no task was created previously, create a new one
            createNewTask();
          } else {
            const { status, audio, voiceId: existingTaskVoiceId } = task;
            /**
             * if previously created task was with a different voice, create
             * a new one.
             *
             * otherwise if it was the same voice, check the status of the
             * task and determing if we can continue with that task or
             * need to create a new one (due to failure)
             */
            if (existingTaskVoiceId !== voiceId) {
              createNewTask();
            } else {
              switch (status) {
                case 'success':
                  if (audio === null) {
                    createNewTask();
                  } else {
                    handleCompleteTask(audio);
                  }
                  break;
                case 'failure':
                  createNewTask();
                  break;
                default:
                  pollTaskStatus();
                  break;
              }
            }
          }
        })
        .catch(handleSpeechRequestError);
    }
  }

  function handleCleanUpTasks() {
    // stop polling
    if (pollRef.current) pollRef.current();
    // abort any in-flight requests
    if (createTaskAbortControllerRef.current)
      createTaskAbortControllerRef.current.abort();
    if (fetchTaskAbortControllerRef.current)
      fetchTaskAbortControllerRef.current.abort();
  }

  function cancelConversion() {
    handleCleanUpTasks();
    dispatch({ type: CANCEL_CONVERSION_TASK });
  }

  function setVoiceId(newVoiceId: VoiceId) {
    dispatch({ type: SET_VOICE_OPTION, payload: { voiceId: newVoiceId } });
  }

  function restart() {
    dispatch({ type: RESTART });
  }
  return [state, { startConversion, cancelConversion, restart, setVoiceId }];
}
