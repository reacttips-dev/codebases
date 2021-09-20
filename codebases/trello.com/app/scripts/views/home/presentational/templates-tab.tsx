/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import {
  ExpandableNavigationItem,
  ExpandableNavigationItemLink,
  ExpandableNavigationItemIcon,
  ExpandableNavigationItemText,
  ExpandableNavigationItemList,
} from 'app/src/components/ExpandableNavigation';
import { HomeTestIds } from '@trello/test-ids';
import { sendErrorEvent } from '@trello/error-reporting';
import { useTemplateCategoriesQuery } from 'app/src/components/Templates/TemplateCategoriesQuery.generated';
import { forTemplate } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';
import { showGalleryLocalization } from 'app/src/components/Templates/Helpers';

const format = forTemplate('templates');

export interface TemplatesTabProps {
  expanded: boolean;
  selected: boolean;
  templateCategory: string;
  href: string;
  onClick: () => void;
  isSubmitPage?: boolean;
}

interface TemplateCategoryTabProps {
  selected: boolean;
  category: string;
  href: string;
  onClick: () => void;
}

export const TemplatesTab: React.FunctionComponent<TemplatesTabProps> = ({
  expanded,
  selected,
  templateCategory,
  isSubmitPage,
  ...props
}) => {
  const {
    data: categoriesQuery,
    error: categoriesError,
  } = useTemplateCategoriesQuery();

  if (categoriesError) {
    sendErrorEvent(new Error(categoriesError.message), {
      tags: {
        ownershipArea: 'trello-teamplates',
      },
      extraData: {
        networkError: categoriesError.networkError
          ? categoriesError.networkError.message
          : false,
        extraInfo: categoriesError.extraInfo,
        graphQLErrors: categoriesError.graphQLErrors.toString(),
        stack: categoriesError.stack ? categoriesError.stack : false,
        name: categoriesError.name,
      },
    });
  }

  const categories =
    (categoriesQuery && categoriesQuery.templateCategories) || [];

  const showSubmitATemplate = showGalleryLocalization();

  return (
    <ExpandableNavigationItem data-test-id={`${HomeTestIds.Templates}`}>
      <ExpandableNavigationItemLink selected={selected} {...props}>
        <ExpandableNavigationItemIcon iconName={'template-board'} />
        <ExpandableNavigationItemText>
          {format('templates')}
        </ExpandableNavigationItemText>
      </ExpandableNavigationItemLink>
      {expanded && Boolean(categories.length) && (
        <>
          <ExpandableNavigationItemList>
            {categories.map((category) => (
              <TemplateCategoryTab
                category={category.key}
                selected={category.key === templateCategory}
                key={category.key}
                href={`/templates/${category.key}`}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => {
                  Analytics.sendClickedLinkEvent({
                    linkName: 'templateCategoryLink',
                    source: 'templateGalleryScreen',
                    attributes: {
                      templateCategory: category.key,
                    },
                  });
                }}
              />
            ))}
            {showSubmitATemplate && (
              <ExpandableNavigationItem>
                <ExpandableNavigationItemLink
                  indented
                  small
                  selected={isSubmitPage}
                  // eslint-disable-next-line react/jsx-no-bind
                  onClick={() =>
                    Analytics.sendClickedLinkEvent({
                      linkName: 'submitTemplateLink',
                      source: 'templateGalleryScreen',
                    })
                  }
                  {...{ href: '/templates/submit' }}
                >
                  <ExpandableNavigationItemText>
                    {`+ ${format('submit-a-template')}`}
                  </ExpandableNavigationItemText>
                </ExpandableNavigationItemLink>
              </ExpandableNavigationItem>
            )}
          </ExpandableNavigationItemList>
        </>
      )}
      {categoriesError && <div>{String(categoriesError)}</div>}
    </ExpandableNavigationItem>
  );
};

const TemplateCategoryTab: React.FunctionComponent<TemplateCategoryTabProps> = ({
  category,
  selected,
  ...props
}) => (
  <ExpandableNavigationItem>
    <ExpandableNavigationItemLink
      selected={selected}
      indented
      small
      quiet
      {...props}
    >
      <ExpandableNavigationItemText>
        {format(category).replace(/&amp;/g, '&')}
      </ExpandableNavigationItemText>
    </ExpandableNavigationItemLink>
  </ExpandableNavigationItem>
);
