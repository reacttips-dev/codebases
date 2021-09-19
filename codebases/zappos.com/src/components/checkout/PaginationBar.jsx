import PropTypes from 'prop-types';

import css from 'styles/components/checkout/paginationBar.scss';

const PaginationBar = ({ currentPage, goToPage, isNextBtnEnabled, isPrevBtnEnabled, nextPage, paginationPages, prevPage, paginationLabel }, { testId = f => f }) => (
  <ul
    className={css.pagination}
    data-test-id={testId('paginationBar')}
    aria-label={`${paginationLabel} Pagination`}
    role="navigation"
  >
    {
      isPrevBtnEnabled && <li data-test-id={testId('prevPage')}>
        <button
          type="button"
          className={css.prevBtn}
          onClick={prevPage}
          aria-label="Previous Page"/>
      </li>
    }
    {
      paginationPages.map((item, i) => {
        if (item === '...') {
          return (
            <li data-test-id={testId('dots')} key={`dots-${i}`}>...</li>
          );
        }
        return (
          <li data-test-id={testId(`page-${item}`)} key={item}>
            {
              item === currentPage
                ? <p aria-label={`Page ${item}`} aria-current="true">{item}</p>
                : <button type="button" onClick={e => goToPage(e, item)} aria-label={`Page ${item}`}>{ item }</button>
            }
          </li>
        );
      })
    }
    {
      isNextBtnEnabled && <li data-test-id={testId('nextPage')}>
        <button
          type="button"
          className={css.nextBtn}
          onClick={nextPage}
          aria-label="Next Page"/>
      </li>
    }
  </ul>
);

PaginationBar.contextTypes = {
  testId: PropTypes.func
};

export default PaginationBar;
