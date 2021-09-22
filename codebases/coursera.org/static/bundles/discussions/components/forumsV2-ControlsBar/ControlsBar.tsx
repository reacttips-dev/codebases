/* @jsx jsx */
import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { questionSorts } from 'bundles/discussions/constants';
import _t from 'i18n!nls/discussions';
import 'css!./__styles__/ControlsBar';
import { ForumDropDownWithTheme } from 'bundles/discussions/components/forumsV2-ForumDropDown/ForumDropDown';
import TopLevelForumsDropDown from 'bundles/discussions/components/forumsV2-ControlsBar/TopLevelForumsDropDown';
import { loadThreads } from 'bundles/discussions/actions/ThreadsActions';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { css, jsx } from '@emotion/react';
import user from 'js/lib/user';

import type { OnDemandCourseForumsV1 } from 'bundles/discussions/components/forumsV2/__types__';
import type OnDemandCourseForumStatisticsV1 from 'bundles/naptimejs/resources/onDemandCourseForumStatistics.v1';
import type { Forum } from 'bundles/discussions/lib/types';
import type { Theme } from '@coursera/cds-core';
import { Grid, Typography, withTheme } from '@coursera/cds-core';

const { mostRecentSort, popularSort } = questionSorts;

type PropsControlsBar = {
  courseForums: OnDemandCourseForumsV1[];
  courseForumStatistics: OnDemandCourseForumStatisticsV1[];
  courseSlug: string;
  inSearch: boolean;
  currentForum: Forum;
  theme: Theme;
};
function forumsByTypeName(forums, typeName): Forum[] {
  return forums.filter((forum) => forum.forumType.typeName === typeName);
}

function subForumsByParentForumId(forums, parentForumId): Forum[] {
  return forums.filter((forum) => forum.parentForumId === parentForumId);
}

class _ControlsBar extends React.Component<PropsControlsBar> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
    executeAction: PropTypes.func.isRequired,
  };

  render() {
    const classes = classNames('rc-forumsV2-ControlsBar', {
      'in-search-mode': this.props.inSearch,
    });

    const forums = forumsByTypeName(this.props.courseForums, this.props.currentForum.forumType.typeName);
    const subforums = subForumsByParentForumId(this.props.courseForums, this.props.currentForum.id);
    const userData = user.get();
    const discussionPath = window.location.pathname;

    const discussionAllThreadsTabLinkCheck = discussionPath.includes('discussions/all');

    return (
      <Grid
        container
        className={classes}
        css={css`
          padding: ${this.props.theme.spacing(12, 0, 12, 8)};
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          border-bottom: 1px solid ${this.props.theme.palette.gray[500]};
        `}
      >
        <Grid
          item
          css={css`
            display: flex;
            flex-flow: row;
            flex-wrap: wrap;
          `}
        >
          {forums && !discussionAllThreadsTabLinkCheck && (
            <div
              css={css`
                padding-right: 8px;
                display: flex;
                align-items: flex-end;
              `}
              className="rc-forumsV2-ControlsBar-ForumsDropDown"
            >
              <TopLevelForumsDropDown
                currentForum={this.props.currentForum}
                courseForums={forums}
                selectedIndex={forums?.findIndex(({ id }) => this.props.currentForum.id === id)}
                courseSlug={this.props.courseSlug}
                param="forum"
                characterLimit={25}
              />
            </div>
          )}
          {subforums && (
            <div
              css={css`
                padding-right: 8px;
              `}
              className="rc-forumsV2-ControlsBar-SubForumsDropDown"
            >
              <TopLevelForumsDropDown
                currentForum={this.props.currentForum}
                courseForums={subforums}
                param="subForum_id"
                courseSlug={this.props.courseSlug}
                unsetOption={{ label: 'All', value: '', forum: this.props.currentForum, param: 'subForum_id' }}
                onChange={(forum, sort, pageNum, filterQueryString) => {
                  this.context.executeAction(loadThreads, {
                    filterQueryString,
                    sort: this.context.router.params?.sort || 'lastActivityAtDesc',
                    pageNum,
                    forumType: forum.forumType.typeName,
                    forumId: forum.id,
                    userId: userData?.id,
                    includeDeleted: false,
                  });
                }}
                characterLimit={25}
              />
            </div>
          )}
        </Grid>
        <Grid item css={{ flexFlow: 'row' }}>
          <Grid
            container
            item
            css={css`
              display: flex;
              flex-flow: row;
            `}
          >
            <Grid
              container
              item
              css={{
                flexFlow: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '16px',
              }}
            >
              <Grid item css={{ paddingRight: '8px' }}>
                <Typography
                  component="span"
                  variant="h3semibold"
                  css={{
                    display: 'inline-block',
                  }}
                >
                  {_t('Sort:')}
                </Typography>
              </Grid>
              <Grid item className="rc-forumsV2-ControlsBar-SortForumsDropDown">
                <ForumDropDownWithTheme<string, 'sort'>
                  css={{
                    display: 'inline-block',
                  }}
                  style={{ width: 'max-content' }}
                  options={[
                    { value: mostRecentSort, param: 'sort', label: _t('Recent') },
                    { value: popularSort, param: 'sort', label: _t('Top') },
                  ]}
                  e2eId="sort-button"
                />
              </Grid>
            </Grid>
            <Grid
              container
              item
              css={{
                flexFlow: 'row',
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}
            >
              <Grid item css={{ paddingRight: '8px' }}>
                <Typography
                  component="span"
                  variant="h3semibold"
                  css={{
                    display: 'inline-block',
                  }}
                >
                  {_t('Filter:')}
                </Typography>
              </Grid>
              <Grid item className="rc-forumsV2-ControlsBar-FilterForumsDropDown">
                <ForumDropDownWithTheme<'true' | 'false', 'answered'>
                  css={{
                    display: 'inline-block',
                  }}
                  options={[
                    { value: undefined, param: 'answered', label: _t('All') },
                    { value: 'true', param: 'answered', label: _t('Answered') },
                    { value: 'false', param: 'answered', label: _t('Unanswered') },
                  ]}
                  e2eId="filter-button"
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export const ControlsBar = withTheme(_ControlsBar);
