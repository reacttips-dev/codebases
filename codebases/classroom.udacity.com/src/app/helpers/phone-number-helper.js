import {
    isValidPhoneNumber
} from 'react-phone-number-input/min';

export function validatePhoneNumber(number = '') {
    return isValidPhoneNumber(number);
}