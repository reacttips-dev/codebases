import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { CategoryIcon, getMasterCategoryList } from 'owa-categories';
import type CategoryType from 'owa-service/lib/contract/CategoryType';
import { useAutoFocus } from '../../hooks/useAutoFocus';

import searchBoxPillWellStyles from './SearchBoxPillWell.scss';

export interface CategoryPillProps {
    categoryName: string;
    isSelected: boolean;
    categoryList?: CategoryType[];
}

export default observer(function CategoryPill({
    categoryName,
    isSelected,
    categoryList,
}: CategoryPillProps) {
    const pillDiv = useAutoFocus<HTMLDivElement>(isSelected);

    return (
        <div ref={pillDiv} tabIndex={-1} className={searchBoxPillWellStyles.categoryPill}>
            <CategoryIcon
                categoryName={categoryName}
                iconClassName={searchBoxPillWellStyles.categoryIcon}
                categoryList={categoryList ? categoryList : getMasterCategoryList()}
            />
            <div className={searchBoxPillWellStyles.categoryPillNameText} title={categoryName}>
                {categoryName}
            </div>
        </div>
    );
});
