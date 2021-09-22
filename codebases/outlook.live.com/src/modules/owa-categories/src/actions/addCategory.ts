import type { CategoryActionSource } from '../index';
import { action } from 'satcheljs';
import type { MailboxInfo } from 'owa-client-ids';

export default action(
    'ADD_CATEGORY',
    (
        name: string,
        colorId: number,
        shouldFavorite: boolean,
        categoryActionSource: CategoryActionSource,
        addFavoriteCategory: (categoryId: string, actionSource: CategoryActionSource) => void,
        mailboxInfo?: MailboxInfo,
        onAfterCreateNewCategory?: (category: string, addCategoryPromise?: Promise<boolean>) => void
    ) => ({
        name,
        colorId,
        shouldFavorite,
        categoryActionSource,
        addFavoriteCategory,
        mailboxInfo,
        onAfterCreateNewCategory,
    })
);
