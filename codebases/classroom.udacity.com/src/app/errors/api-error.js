class ApiError extends Error {
    constructor({
        message,
        status
    }) {
        super(message);
        this.name = 'ApiError';
        this.status = status || 500;
    }
}

export default ApiError;