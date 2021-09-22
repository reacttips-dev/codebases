import type ApiErrorCode from './ApiErrorCode';

class ApiError {
    errorCode: ApiErrorCode;

    constructor(errorCode: ApiErrorCode) {
        this.errorCode = errorCode;
    }
}

export default ApiError;
