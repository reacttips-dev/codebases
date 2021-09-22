/* @jsx jsx */
import React from 'react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import { DropdownButton, MenuItem } from 'react-bootstrap-33';

import type { Course, Module } from 'bundles/video-highlighting/review-page/types';
import { useTheme } from '@coursera/cds-core';

import _t from 'i18n!nls/video-highlighting';
import 'css!./__styles__/NotesPageFilterDropdown';

/*
This is a copy of bundles/video-highlighting/review-page/private/NotesPageFilterDropdown.tsx
Just with different style, used in the CDS version of the page until we have the CDS Dropdown ready
We are still using some stylus for some harder-to-move-to-emotion styles
*/

type Props = {
  course: Course;
  modules: Array<Module>;
  selectedContentId?: string;
  onSelect: (x: string) => void;
};

type CourseContent = Course & { contentType: 'course' };
type ModuleContent = Module & { contentType: 'module' };
type Content = CourseContent | ModuleContent;

// TODO: Note that here the tabindex and keydown events
// are explicitly handled by inner menu item elements.
// Ideally this would be handled by whatever dropdown menu
// library was being used, but the standard we have (react-bootstrap)
// doesn't.
const FilterDropdownItem = ({
  content,
  inMenu,
  onEnterKey,
}: {
  content?: Content;
  inMenu: boolean;
  onEnterKey?: () => void;
}) => {
  const onKeyDown =
    onEnterKey &&
    ((e: $TSFixMe) => {
      if (e.key === 'Enter') {
        onEnterKey();
      }
    });

  const menuItemProps = inMenu
    ? {
        role: 'menuitem',
        tabIndex: 0,
        onKeyDown,
      }
    : {};

  return !content || content.contentType === 'course' ? (
    <span {...menuItemProps}>{_t('All notes')}</span>
  ) : (
    <div
      {...menuItemProps}
      css={css`
        width: 100%;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      `}
    >
      {content.name}
    </div>
  );
};

const NotesPageFilterDropdown = ({
  course,
  modules,
  selectedContentId,
  onSelect = () => {
    /* Empty */
  },
}: Props) => {
  const theme = useTheme();
  const resolvedSelectedId = selectedContentId || course.id;
  const courseContent: CourseContent = {
    contentType: 'course',
    ...course,
  };

  const modulesContent: Array<ModuleContent> = modules.map((module) => ({
    contentType: 'module',
    ...module,
  }));

  const allContent = [courseContent, ...modulesContent];
  const selectedContent = allContent.find((content) => content.id === resolvedSelectedId);
  const selectedContentName = selectedContent?.name || 'All notes';

  const title = (
    <div
      css={css`
        width: calc(100% - 10px);
        padding: ${theme.spacing(4, 0)};
        display: inline-block;
        text-align: left;
        color: ${theme.palette.black[500]};
      `}
    >
      <FilterDropdownItem content={selectedContent} inMenu={false} />
    </div>
  );

  return (
    <div
      css={css`
        /* 
          We are setting the typography of components that are not yet migrated to CDS and that are still being used by the original page 
          We don't want to override the font if the rest of the page is not using CDS
        */
        * {
          ${theme.typography.body1};
        }
        margin: ${theme.spacing(12, 0, 24)};
        .bt3-dropdown {
          width: 100%;
        }
        ${theme.breakpoints.up('sm')} {
          .bt3-dropdown {
            max-width: 306px;
          }
        }
        .bt3-btn {
          width: 100%;
        }
        .bt3-dropdown-menu {
          width: 100%;
        }
      `}
      className="rc-NotesPageFilterDropdown"
    >
      <DropdownButton title={title} onSelect={onSelect} aria-label={`Notes dropdown, ${selectedContentName}, selected`}>
        {allContent.map((content) => (
          <MenuItem key={content.id} eventKey={content.id}>
            <FilterDropdownItem
              inMenu
              content={content}
              onEnterKey={() => {
                onSelect(content.id);
              }}
            />
          </MenuItem>
        ))}
      </DropdownButton>
    </div>
  );
};

export default NotesPageFilterDropdown;
