import {
    __
} from 'services/localization-service';
const WORKSPACE_ERROR = 'WorkspaceError';
const UNRECOGNIZED_ERROR = 'UnrecognizedError';
const POLLING_TIMEOUT_ERROR = 'PollingTimeoutError';
const TOO_MANY_STARS_ERROR = 'TooManyStarsError';
const BOUNCE_REDIRECT_ERROR = 'BounceRedirectError';
const METER_ERROR = 'MeterError';
const GPU_TIME_EXPIRED = 'GPUTimeExpired';
const GPU_CONFLICT_ERROR = 'GPUConflictError';
const RESOURCE_NOT_FOUND = 'ResourceNotFound';

export function isWorkspaceError(err = {}) {
    return err.type === WORKSPACE_ERROR;
}

export function isGPUConflictError(err = {}) {
    return err.name === GPU_CONFLICT_ERROR;
}

export function isResourceNotFoundError(err = {}) {
    return err.name === RESOURCE_NOT_FOUND;
}

export function isMeterError(err = {}) {
    return err.name === METER_ERROR;
}

export function isGPUTimeExpired(err = {}) {
    return err.name === GPU_TIME_EXPIRED;
}

export function isPollingTimeoutError(err = {}) {
    return err.name === POLLING_TIMEOUT_ERROR;
}

export function isBounceRedirectError(err = {}) {
    return err.name === BOUNCE_REDIRECT_ERROR;
}

export function isTooManyStarsError(err = {}) {
    return err.name === TOO_MANY_STARS_ERROR;
}

function sanitize(resp) {
    let star;
    if (resp && resp.star) {
        star = _.omit(resp.star, ['token']);
    }
    return { ...resp,
        star
    };
}

class WorkspaceError extends Error {
    constructor(details) {
        super();
        this.type = WORKSPACE_ERROR;
        this.name = UNRECOGNIZED_ERROR;
        this.message = [
                __('Workspace Services encountered an error.'),
                typeof details === 'string' ? details : '',
            ]
            .filter(Boolean)
            .join(' ');
        this.timestamp = Date();
        // Any information that may be helpful for debugging
        // but not intended for the end user.
        this.privateDetails = details;
    }
}

class PollingTimeoutError extends WorkspaceError {
    constructor(resp) {
        const MINUTES = 60 * 1000;
        const min = Math.floor(resp.pollingTimeout / MINUTES);
        const details = sanitize(resp);
        super(details);
        this.name = POLLING_TIMEOUT_ERROR;
        this.message = __(
            'After polling for <%= min %> minutes, the response failed to meet the ready condition.', {
                min
            }
        );
    }
}

class TooManyStarsError extends WorkspaceError {
    constructor(resp) {
        super(resp);
        this.name = TOO_MANY_STARS_ERROR;
        this.message = __(
            'While polling for a virtual machine, too many machines were offered that did not meet the ready condition.'
        );
    }
}

class BounceRedirectError extends WorkspaceError {
    constructor(error) {
        const {
            timeAgo,
            dateTime,
            url
        } = error.bounce || {};
        super(error);
        this.name = BOUNCE_REDIRECT_ERROR;
        this.message = __(
            'Redirecting failed to save a cookie at "<%= url %>". This is necessary to establish a connection to the remote machine. The browser was last redirected <%= timeAgo %> on <%= dateTime %>', {
                url,
                timeAgo,
                dateTime
            }
        );
    }
}

class MeterError extends WorkspaceError {
    constructor(error) {
        super(error);
        this.name = METER_ERROR;
        this.message = __('You must specify a cpu or gpu enabled workspace.');
    }
}

class GPUTimeExpired extends WorkspaceError {
    constructor(error) {
        super(error);
        this.name = GPU_TIME_EXPIRED;
        this.message = __('Your GPU time has run out.');
    }
}

class GPUConflictError extends WorkspaceError {
    constructor(error) {
        super(error);
        this.name = GPU_CONFLICT_ERROR;
        this.message = error.error;
        this.starId = error.starId;
    }
}

class ResourceNotFound extends WorkspaceError {
    constructor(error) {
        super(error);
        this.name = RESOURCE_NOT_FOUND;
        this.message = __(
            'Unable to find the star requested. This usually happens when a delete request is received for a star that has already been deleted.'
        );
    }
}

// If resp is from Nebula, then it will have these fields
// error - short description of error
// starId - identifies the vm causing the error (optional)
// errorCode - unique string name
// statusCode - html status codes
export function createWorkspaceError(resp = {}) {
    const error = resp.responseJSON || {
        errorCode: 'no errorCode available'
    };
    const code = error.errorCode;

    if (resp instanceof Error) {
        return resp;
    }
    if (code === 'workspace_vm_conflict') {
        return new GPUConflictError(error);
    }
    if (code === 'meter_choice_required') {
        return new MeterError(error);
    }
    if (code === 'no_time_remaining') {
        return new GPUTimeExpired(error);
    }
    if (code === 'resource_not_found') {
        return new ResourceNotFound(error);
    }
    if (resp.pollingTimeout) {
        return new PollingTimeoutError(resp);
    }
    if (resp.previousStars) {
        return new TooManyStarsError(resp);
    }
    if (resp.bounce) {
        return new BounceRedirectError(resp);
    }
    // Unrecognized Error
    return new WorkspaceError(error.error || resp);
}