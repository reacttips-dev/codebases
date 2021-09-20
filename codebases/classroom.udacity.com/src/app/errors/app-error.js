const APP_ERROR = 'AppError';
export const GENERAL_ERROR_SCREEN = 'GENERAL_ERROR_SCREEN';

class AppError extends Error {
    constructor(message) {
        super(message);

        this.name = 'AppError';
    }
}

export function isAppError(error) {
    return error.name === APP_ERROR;
}

export default AppError;