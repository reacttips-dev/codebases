import { internalGetScopedPath, isIndexTest, isExplicitTest } from './internalGetScopedPath';

export default function getScopedPath(rootPath: string): string {
    return internalGetScopedPath(rootPath, [isIndexTest, isExplicitTest]);
}
