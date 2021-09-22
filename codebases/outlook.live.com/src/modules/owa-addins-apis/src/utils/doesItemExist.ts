import { isAdapterPresent } from 'owa-addins-adapters';

export default function doesItemExist(hostItemIndex: string): boolean {
    return isAdapterPresent(hostItemIndex);
}
