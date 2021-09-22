export function getServerErrorName(errorResponse: Response) {
    return (
        errorResponse?.headers &&
        (errorResponse.headers.get('x-owa-error') ||
            errorResponse.headers.get('x-auth-error') ||
            errorResponse.headers.get('x-redir-error') ||
            errorResponse.headers.get('x-jit-error'))
    );
}
