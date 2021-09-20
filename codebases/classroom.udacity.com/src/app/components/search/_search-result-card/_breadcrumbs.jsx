import { IconCaretRight } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import styles from './_breadcrumbs.scss';

const Breadcrumbs = cssModule(
  ({ breadcrumbTitles }) => (
    <ol styleName="breadcrumbs-container">
      {_.map(breadcrumbTitles, (title, idx) => (
        <li key={idx}>
          <p styleName="title" dangerouslySetInnerHTML={{ __html: title }} />
          {idx + 1 < breadcrumbTitles.length ? (
            <IconCaretRight size="sm" styleName="delimiter" />
          ) : null}
        </li>
      ))}
    </ol>
  ),
  styles
);

Breadcrumbs.propTypes = {
  breadcrumbTitles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Breadcrumbs.displayName = 'search/_result-card/_breadcrumbs';

export default Breadcrumbs;
