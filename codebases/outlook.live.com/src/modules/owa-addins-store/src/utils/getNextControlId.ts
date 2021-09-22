import { getGuid } from 'owa-guid';

export default function getNextControlId(): string {
    return getGuid();
}
