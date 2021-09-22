import React from 'react';
import _t from 'i18n!nls/discussions';
import PaginationState, { PaginationStateConsumer } from '../../../__components/PaginationState';
import { PaginationStateRenderProps } from '../../../__components/PaginationState/__types__';
import { Providers } from '../../../__providers__/ForumPostDataProvider';
import { ShimmerState } from '../../../ForumThread';
import { ForumAnswersDataProviderResponse } from '../../../__providers__/ForumPostDataProvider/__types__';

type PaginatedAnswersRenderProps = PaginationStateRenderProps & ForumAnswersDataProviderResponse;

type Props = {
  id: string;
  limit: number;
  sortOrder?: string;
  children: (props: PaginatedAnswersRenderProps) => JSX.Element | null;
};

class PaginatedAnswersDataProvider extends React.Component<Props> {
  render() {
    const { id, limit, sortOrder, children } = this.props;

    return (
      <PaginationState routerParamPage="page" routerParamLimit="limit" initialLimit={limit}>
        <PaginationStateConsumer>
          {({
            page: paginatedPage,
            limit: paginatedLimit,
            setPage,
            setLimit,
          }: PaginationStateRenderProps & { setPage: (n: number) => {} }) => (
            <Providers.Answers forumQuestionId={id} limit={paginatedLimit} page={paginatedPage} sortOrder={sortOrder}>
              {({ loading, error, data }) => {
                const replies = data?.replies;
                if (loading) {
                  return <ShimmerState />;
                }
                if (error) {
                  return <section>{_t('oopse something went wrong')}</section>;
                }
                if (data && data.replies) {
                  return children({ page: paginatedPage, limit: paginatedLimit, setPage, setLimit, replies });
                }
                return null;
              }}
            </Providers.Answers>
          )}
        </PaginationStateConsumer>
      </PaginationState>
    );
  }
}

export default PaginatedAnswersDataProvider;
