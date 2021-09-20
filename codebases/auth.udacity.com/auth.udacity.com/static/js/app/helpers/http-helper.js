import _get from 'lodash/get';

export function isStatus(error, status) {
    return _get(error, 'response.status') === status;
}