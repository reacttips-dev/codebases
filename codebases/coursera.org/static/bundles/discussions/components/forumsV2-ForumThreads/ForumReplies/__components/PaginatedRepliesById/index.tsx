import React from 'react';
import _ from 'underscore';
import connectToRouter from 'js/lib/connectToRouter';
import { PaginationControls } from '@coursera/coursera-ui';
import { ForumPostWithCreator } from '../../../__providers__/ForumPostDataProvider/__types__';
import PaginatedAnswersDataProvider from '../../__providers__/PaginatedAnswersDataProvider';
import SectionDivider from '../../../../forumsV2-SectionDivider';
import 'css!./__styles__';

function pageCount({ totalCount, stepCount }: { totalCount: number; stepCount: number }): number {
  return Math.ceil(totalCount / stepCount);
}
function PaginatedReplies({
  id,
  topLevelAnswerCount,
  limit = 5,
  sortOrder,
  children,
}: {
  id: string;
  limit?: number;
  topLevelAnswerCount: number;
  sortOrder?: string;
  children?: ({ replies, page }: { replies: ForumPostWithCreator[]; page?: number }) => {} | null;
}) {
  return (
    <PaginatedAnswersDataProvider limit={limit} id={id} sortOrder={sortOrder}>
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
                  currentPage={paginatedPage}
                  maxPages={5}
                  pageCount={totalPageCount}
                  onClickHandler={(p: number) => setPage(p)}
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
