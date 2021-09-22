import type { ClientItem } from 'owa-mail-store';

export const isSmimeDecoded = (item: ClientItem): boolean => item?.Smime?.isDecoded;

export default isSmimeDecoded;
