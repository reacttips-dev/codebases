import { MARK_ID_PREFIX, MARK_ID_NUMBER_LEN } from './constants';

// Create unique identifier for the mark on a keyword
export default function createMarkId() {
    // Convert Math.random() to base 36 (total characters, i.e. numbers + letters)
    // Take first MARK_ID_NUMBER_LEN characters after decimal
    return MARK_ID_PREFIX + Math.random().toString(36).substr(2, MARK_ID_NUMBER_LEN);
}
