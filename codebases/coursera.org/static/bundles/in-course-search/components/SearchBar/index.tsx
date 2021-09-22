/** @jsx jsx */
import { useState, useEffect } from 'react';
import type { FormEvent, MouseEvent } from 'react';
import { TextInput } from '@coursera/coursera-ui';
import { Button, Grid, useTheme } from '@coursera/cds-core';
import _t from 'i18n!nls/in-course-search';
import { css, jsx } from '@emotion/react';
import useRouter from 'js/lib/useRouter';
import { useRetracked } from 'js/lib/retracked';
import sessionStorageEx from 'bundles/common/utils/sessionStorageEx';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import TrackedButton from 'bundles/page/components/TrackedButton';
import { SEARCH_BACK_STORAGE_KEY } from '../constants';
import TutorialTooltip from '../TutorialTooltip';

type Props = {
  /**
   * referrer is a property, which, when set, provides the in-course-search application a location to return users to.
   * If one is not provided, it will return the users to course home
   * */
  referrer?: string;
  /** loading is a flag that can be used to disable further input while set */
  loading?: boolean;
  /**
   * isInternal determines whether to use react-router navigation or browser level navigation.
   * This should only be set true within in-course-search
   */
  isInternal?: boolean;
};

const TrackedTextInput = withSingleTracked({ type: 'CHECKBOX' })(TextInput);

/**
 * Search bar for internal and external access to in course-search results.
 * Submitting a term takes you to the search page, storing the term in the query
 * If a referrer is provided, it will be stored in SessionStorage for use by BackButton.
 * The search page independently listens to the URL to perform the search
 */
export const CourseSearchBar = ({ referrer, loading, isInternal }: Props) => {
  useEffect(() => {
    if (referrer) {
      sessionStorageEx.setItem(SEARCH_BACK_STORAGE_KEY, referrer, String);
    }
  }, [referrer]);
  const track = useRetracked();
  const theme = useTheme();
  const router = useRouter();
  const [searchValue, setSearchValue] = useState(router.location.query?.term ? router.location.query?.term : '');
  const [hasError, setHasError] = useState(false);
  const searchCourseLabel = _t('Search in course');

  useEffect(() => {
    setSearchValue(router.location.query?.term ? router.location.query?.term : '');
  }, [router.location.query?.term]);

  const submitTerm = (e: FormEvent<HTMLFormElement> | MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!searchValue) {
      setHasError(true);
      return;
    }
    setHasError(false);

    track({
      trackingName: 'search_query_submit',
      action: 'submit',
      trackingData: { searchTerm: searchValue },
    });

    const courseSlug = router.params?.courseSlug;
    const path = `/learn/${courseSlug}/search`;
    if (isInternal) {
      router.push({
        pathname: path,
        query: {
          term: searchValue,
          tab: router.location.query.tab,
          page: 1,
        },
      });
    } else {
      const url = new URL(window.location.href);
      url.pathname = path;
      url.searchParams.set('term', searchValue);
      window.location.assign(url.toString());
    }
  };

  return (
    <form onSubmit={submitTerm}>
      <Grid
        container
        direction="row"
        wrap="nowrap"
        data-test="rc-InCourseSearchBar"
        css={css`
          margin-top: ${theme.spacing(12)};
          input {
            ${theme.typography.body1};
            border-radius: 4px 0px 0px 4px;
            max-height: 36px;
          }
          button {
            border-radius: 0px 4px 4px 0px;
          }
          ${theme.breakpoints.down('xs')} {
            div:first-of-type {
              min-width: 0;
            }
          }
        `}
      >
        <TrackedTextInput
          componentId="rc-InCourseSearchBarInput"
          placeholder={searchCourseLabel}
          label={searchCourseLabel}
          hideLabel
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          disabled={loading}
          error={hasError}
          trackingName="search_query_input"
          trackingData={{ searchTerm: searchValue }}
        />
        <Button
          type="submit"
          size="small"
          component={TrackedButton}
          trackingName="search_button_click"
          withVisibilityTracking={true}
          requireFullyVisible={false}
          onClick={submitTerm}
          data={{ searchTerm: searchValue }}
        >
          {_t('Search')}
        </Button>
      </Grid>
      <TutorialTooltip />
    </form>
  );
};

export const Loader = () => {
  const theme = useTheme();
  return (
    <div
      data-test="CourseSearchBarLoader"
      css={css`
        height: 36px;
        width: 100%;
        border-radius: 4px;
        background-color: ${theme.palette.gray[100]};
        margin-top: ${theme.spacing(12)};
      `}
    />
  );
};

export default CourseSearchBar;
