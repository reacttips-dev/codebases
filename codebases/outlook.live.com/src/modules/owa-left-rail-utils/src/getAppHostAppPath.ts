import { getAppHostPath } from 'owa-url';
import type { OfficeApp } from './store/schema/OfficeApp';

export default function getAppHostAppPath(app: OfficeApp): string {
    return getAppHostPath() + app;
}
