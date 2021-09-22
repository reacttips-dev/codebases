export function parseErrorString(errorMessage: any): string | null {
    const errorType = typeof errorMessage;
    if (errorType === 'object' && errorMessage.message) {
        return errorMessage.message;
    } else if (errorType == 'string') {
        return errorMessage;
    }
    return null;
}
