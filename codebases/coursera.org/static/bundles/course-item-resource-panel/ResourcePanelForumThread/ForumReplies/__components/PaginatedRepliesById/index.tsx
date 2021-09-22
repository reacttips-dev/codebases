import React from 'react';
import { PaginationControls } from '@coursera/coursera-ui';
import { ForumPostWithCreator } from '../../../__providers__/ForumPostDataProvider/queries/RestForumAnswersById';
import PaginatedAnswersDataProvider from '../../__providers__/PaginatedAnswersDataProvider';
import SectionDivider from '../../../../__components/SectionDivider';
import 'css!./__styles__';

function pageCount({ totalCount, stepCount }: { totalCount: number; stepCount: number }): number {
  return Math.ceil(totalCount / stepCount);
}
function PaginatedReplies({
  id,
  topLevelAnswerCount,
  limit = 5,
  children,
}: {
  id: string;
  limit?: number;
  topLevelAnswerCount: number;
  children?: ({ replies, page }: { replies: ForumPostWithCreator[]; page?: number }) => {} | null;
}) {
  return (
    <PaginatedAnswersDataProvider limit={limit} id={id}>
      {({ setPage, limit: paginatedLimit, page: paginatedPage, replies }) => {
        const totalPageCount = pageCount({ totalCount: topLevelAnswerCount, stepCount: paginatedLimit });
        return (
          <div className="PaginatedReplies">
            {children && typeof children === 'function' && replies && children({ replies, page: paginatedPage })}
            {totalPageCount > 1 && <SectionDivider key="paginationControls-sectionDivider" />}
            {totalPageCount > 1 && (
              <div className="PaginatedReplies__nav">
                <PaginationControls
                  key="paginationControls"
                  currentPage={paginatedPage + 1} // these pagination controls start at 0 but the controller and apis use 0
                  maxPages={5}
                  pageCount={totalPageCount}
                  onClickHandler={(p: number) => setPage(p - 1)}
                />
              </div>
            )}
          </div>
        );
      }}
    </PaginatedAnswersDataProvider>
  );
}

export default PaginatedReplies;
