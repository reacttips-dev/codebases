import _isEmpty from 'lodash/isEmpty';
import {
    __
} from '../../services/localization-service';

function isValidAge(day, month, year, ageMinimum) {
    let today = new Date();

    let curYear = today.getFullYear();
    let curMonth = today.getMonth() + 1;
    //use UTC Date
    let curDay = today.getUTCDate();

    let ageDiff = curYear - year;
    let monthDiff = curMonth - month;
    let dayDiff = curDay - day;

    let age =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? ageDiff - 1 : ageDiff;
    return age >= ageMinimum;
}

function isValidDate(day, month, year) {
    // some browsers doesn't support date string format like YYYY-MM-DD or YYYY/MM/DD to parse the correct date.
    // Use number to create the valid date.
    // the month number for date object starts from 0. like jan -- 0, feb -- 1.
    let date = new Date(year, month - 1, day);
    // if the date is not valid in this month, for example, Feb-30-2018,
    // the Date library will parse it to next month --> Mar-2-2018.
    // checking whether the month is equal to getMonth + 1 for date validation.
    return date.getMonth() + 1 === parseInt(month);
}

// Format number with given base
// e.g: 1 -> 01 in 10 base, 1 -> 001 in hundred base
export const formatNumber = (number, base = '00') => {
    return (base + number).slice(-base.length);
};

export const validateBirthdate = (ageMinimum, day, month, year) => {
    let birthdate = {};
    if (!isValidDate(day, month, year)) {
        birthdate.invalidDate = __('The day is not in this month');
    } else if (!isValidAge(day, month, year, ageMinimum)) {
        birthdate.insufficientBirthday = __(
            'Birthday does not meet the criteria to register in your region.'
        );
    }
    return birthdate;
};

/* http://www.regular-expressions.info/email.html */
const EMAIL_REGEX = /^[A-Z0-9._%'+-\]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

export const isValidEmail = (email) => {
    return EMAIL_REGEX.test(email);
};

export const validateForm = (formValues, ageRequirement) => {
    const {
        firstName = '',
            lastName = '',
            email = '',
            password = '',
            day = '',
            month = '',
            year = ''
    } = formValues;
    let fieldErrors = {};

    if (!isValidEmail(email)) {
        fieldErrors.email = __('Is not a valid email');
    }

    if (password.length < 10) {
        fieldErrors.password = __('Password must contain at least 10 characters');
    } else if (calcPasswordStrength(password) < 3) {
        fieldErrors.password = __('Password is too weak');
    }

    if (
        ageRequirement !== undefined &&
        ageRequirement !== null &&
        ageRequirement.ageRequired
    ) {
        let birthdateError = validateBirthdate(
            ageRequirement.ageMinimum,
            day,
            month,
            year
        );
        if (birthdateError.invalidDate) {
            fieldErrors.invalidDate = birthdateError.invalidDate;
        }
        if (birthdateError.insufficientBirthday) {
            fieldErrors.insufficientBirthday = birthdateError.insufficientBirthday;
        }
    }

    if (_isEmpty(firstName)) {
        fieldErrors.firstName = __('Must be specified');
    }

    if (_isEmpty(lastName)) {
        fieldErrors.lastName = __('Must be specified');
    }

    return fieldErrors;
};

const countUniqChars = (password) => {
    let seen = '';
    for (let i = 0; i < password.length; i++) {
        if (seen.indexOf(password[i]) === -1) {
            seen += password[i];
        }
    }
    return seen.length;
};

// Returns 0-3
export const calcPasswordStrength = (password) => {
    if (password.length < 1) {
        return 0;
    }

    if (password.length < 10) {
        return 1;
    }

    const entropy = countUniqChars(password);
    if (entropy < 8) {
        return 2;
    }

    return 3;
};