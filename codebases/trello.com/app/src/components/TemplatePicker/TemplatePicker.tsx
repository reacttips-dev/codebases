import React from 'react';
import { forTemplate } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { TemplateTile, TemplateTileProps } from './TemplateTile';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { Select } from '@trello/nachos/select';
import { Analytics } from '@trello/atlassian-analytics';
import { CloseIcon } from '@trello/nachos/icons/close';
import { TemplateBoardIcon } from '@trello/nachos/icons/template-board';

import styles from './TemplatePicker.less';
import { Category } from './types';

const formatTemplatePicker = forTemplate('templates_picker');

interface TemplatePickerProps
  extends Pick<TemplateTileProps, 'onTemplateClicked'> {
  onDismiss: () => void;
  templateIds: string[];
  selectedCategory: Category;
  onChangeCategory: (category: { value: Category; label: string }) => void;
}

const onExploreMoreTemplatesClick = () => {
  Analytics.sendClickedLinkEvent({
    linkName: 'exploreTemplatesLink',
    source: 'templatePickerSection',
  });
};

const categoryToStringKeyHash: Record<Category, string> = {
  [Category.Popular]: 'popular',
  [Category.Business]: 'small-business',
  [Category.Education]: 'education',
  [Category.Engineering]: 'engineering-it',
  [Category.Marketing]: 'marketing',
  [Category.HumanResources]: 'human-resources',
  [Category.Operations]: 'operations',
  [Category.SalesCRM]: 'sales-crm',
  [Category.Design]: 'design',
};

export const TemplatePicker: React.FunctionComponent<TemplatePickerProps> = ({
  onDismiss,
  templateIds,
  onTemplateClicked,
  selectedCategory,
  onChangeCategory,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <div className={styles.iconHeaderContainer}>
          <TemplateBoardIcon
            size="large"
            dangerous_className={styles.templateBoardIcon}
          />
          <h2>
            {selectedCategory === 'popular'
              ? formatTemplatePicker('most-popular-templates')
              : formatTemplatePicker(
                  `suggested-${categoryToStringKeyHash[selectedCategory]}`,
                )}
          </h2>
        </div>
        <Button
          onClick={onDismiss}
          className={styles.dismissButton}
          iconBefore={<CloseIcon size="medium" />}
        />
      </div>
      <span className={styles.subheader}>
        {formatTemplatePicker('get-going-faster', {
          chooseACategoryLink: (
            <span className={styles.categorySelector} key="category-selector">
              <Select
                placeholder={formatTemplatePicker('choose-a-category')}
                value={selectedCategory}
                options={Object.keys(Category).map((category) => ({
                  value: Category[category as keyof typeof Category],
                  label: formatTemplatePicker(
                    categoryToStringKeyHash[
                      Category[category as keyof typeof Category]
                    ],
                  ),
                }))}
                onChange={onChangeCategory}
                controlShouldRenderValue={false}
              />
            </span>
          ),
        })}
      </span>
      <div className={styles.templatesContainer}>
        {templateIds.map((templateId) => (
          <TemplateTile
            key={templateId}
            boardId={templateId}
            onTemplateClicked={onTemplateClicked}
          />
        ))}
      </div>
      <p className={styles.templateGalleryLink}>
        <RouterLink href="/templates" onClick={onExploreMoreTemplatesClick}>
          {formatTemplatePicker('browse-the-full-template-gallery')}
        </RouterLink>
      </p>
    </div>
  );
};
