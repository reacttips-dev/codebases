/**
 * When API promise is invoked from a component, we'll need some api status related updates,
 * e.g. show progress bar, error , success msg
 * Sometimes other components may also want to make changes based on the api status,
 * e.g. show alerting message
 *
 * #### Create an ApiNotification ####
 const {ApiNotification} = require('bundles/phoenix/components/ApiNotification');
 const apiNotification = new ApiNotification({
   apiTag: ProgramInvitationsApiManager.generateFullApiTag(PROCESS_INVITATIONS),
 }, {
   resourceName: this._resourceName,
   method: 'POST',
   programId: this._programId,
   action: 'processImport',
   fileUrl,
   sendInvitations,
 });

 #### Dispatch updatedApiNotification to the store where apiPromise is being invoked ####
 * const {
 *   API_BEFORE_SEND, API_IN_PROGRESS, API_SUCCESS, API_ERROR, updateApiNotification,
 * } = require('bundles/phoenix/components/ApiNotification');
 * handleApiPromise = ({apiPromise, apiNotification}) => {
 *  this.setState({apiStatus: API_IN_PROGRESS, error: null, response: null});
 *  apiNotification.setApiInProgress();
 *  apiPromise
 *    .then((response) => {
 *      apiNotification.setApiSuccess(response);
 *      this.setState({response, apiStatus: API_SUCCESS});
 *    })
 *    .fail((error) => {
 *      this.setState({ error, apiStatus: API_ERROR});
 *      this.context.executeAction(updateApiNotification, {apiNotification});
 *    })
 *    .done();
 * }
 */

// API Status
const API_BEFORE_SEND = 'API_BEFORE_SEND' as const;
const API_IN_PROGRESS = 'API_IN_PROGRESS' as const;
const API_SUCCESS = 'API_SUCCESS' as const;
const API_ERROR = 'API_ERROR' as const;

const API_STATUS = {
  API_BEFORE_SEND,
  API_IN_PROGRESS,
  API_SUCCESS,
  API_ERROR,
} as const;

export type ApiStatusType = typeof API_STATUS[keyof typeof API_STATUS];

export type ApiResponse = $TSFixMe;
export type ApiError = $TSFixMe;

// The Api notification can be identified by apiTag. apiTag may not be unique,
// but good enough to identify the api call, common format: prefix + apiName
class ApiNotification {
  _apiTag: string;

  _apiDetail: $TSFixMe;

  _response: ApiResponse | null;

  _error: ApiError | null;

  _apiStatus: ApiStatusType;

  constructor(apiTag: string, { resourceName, method, id, params, data, ...moreInfo }: $TSFixMe) {
    this._apiTag = apiTag;
    this._apiDetail = { resourceName, method, id, params, data, ...moreInfo };
    this._response = null;
    this._error = null;
    this._apiStatus = API_BEFORE_SEND;
  }

  // This is useful when batch generating apiTag at container (e.g. table), but need to
  // customize at the item level (e.g. cell), or need to add more tags to specify where the
  // operation is initialzied (e.g. individual row or batch operation)
  appendToApiTag(stringToAppend: string) {
    this._apiTag += stringToAppend;
  }

  setApiInProgress() {
    this._apiStatus = API_IN_PROGRESS;
  }

  setApiSuccess(response: ApiResponse) {
    this._apiStatus = API_SUCCESS;
    this._response = response;
  }

  setApiError(error: ApiError) {
    this._apiStatus = API_ERROR;
    this._error = error;
  }

  get response() {
    return this._response;
  }

  get error() {
    return this._error;
  }

  get apiStatus() {
    return this._apiStatus;
  }

  get apiTag() {
    return this._apiTag;
  }

  get apiDetail() {
    return this._apiDetail;
  }

  // Derived fields
  get errorMsg() {
    return this._error && this._error.msg;
  }

  get errorCode() {
    return this._error && this._error.errorCode;
  }

  get elements() {
    return this._response && this._response.elements;
  }
}

export { API_BEFORE_SEND, API_IN_PROGRESS, API_SUCCESS, API_ERROR, ApiNotification };
