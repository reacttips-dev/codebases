import * as React from 'react';
import { Category } from '../index';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import { logUsage } from 'owa-analytics';
import { observer } from 'mobx-react-lite';

export interface CategoryWellProps {
    categoryWellContainerClass: string;
    categoryContainerClass?: string;
    categories: string[];
    onCategoryClicked?: (
        ev: React.MouseEvent<unknown>,
        category: string,
        actionSource: string
    ) => void;
    categoryList?: CategoryType[];
}

function useLogNumberOfCategories(categories: string[]) {
    React.useEffect(() => {
        logUsage('Category_Well_TotalCategories', [categories.length], { sessionSampleRate: 10 });
    }, [categories]);
}

export default observer(function CategoryWell(props: CategoryWellProps) {
    const {
        categoryContainerClass,
        categories,
        categoryWellContainerClass,
        onCategoryClicked,
        categoryList,
    } = props;

    useLogNumberOfCategories(categories);

    const CategoryWellEntry = React.useCallback(
        ({ categoryName, isLastInWell }: { categoryName: string; isLastInWell: boolean }) => (
            <Category
                actionSource={'CategoryWell'}
                category={categoryName}
                containerClassName={categoryContainerClass}
                isLastInWell={isLastInWell}
                onCategoryClicked={onCategoryClicked}
                categoryList={categoryList}
            />
        ),
        [categoryContainerClass, onCategoryClicked, categoryList]
    );

    // Categories are listed in the order that they are applied to the item, but they need
    // to be displayed such that the most recently applied category is first i.e. reverse order
    const categoriesInMostRecentOrder = [...categories].reverse();

    return (
        <div className={categoryWellContainerClass}>
            {categoriesInMostRecentOrder.map((categoryName, i) => (
                <CategoryWellEntry
                    key={categoryName}
                    categoryName={categoryName}
                    isLastInWell={i === categories.length - 1}
                />
            ))}
        </div>
    );
});
