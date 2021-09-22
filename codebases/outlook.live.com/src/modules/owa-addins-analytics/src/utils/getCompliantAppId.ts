import type Extension from 'owa-service/lib/contract/Extension';
import { getCompliantAppIdHandler } from 'owa-addins-osfruntime';

export function getCompliantAppId(extension: Extension): string {
    return getCompliantAppIdHandler(extension);
}
