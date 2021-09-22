import { lazySelectFavoriteCategory } from 'owa-mail-folder-forest-actions';

export interface CategoryRouteParameters {
    categoryId: string;
}

export default async function mailCategoryRouteHandler(parameters: CategoryRouteParameters) {
    await lazySelectFavoriteCategory.importAndExecute(parameters.categoryId);
}
