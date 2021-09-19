import PropTypes from 'prop-types';
import template from 'lodash.template';

import HtmlToReact from 'components/common/HtmlToReact';

import css from 'styles/components/checkout/note.scss';

export const Note = (_params, { testId, marketplace: { checkout: { footerText, helpUrl: { salesTax } } } }) => {
  const notesTemplate = template(footerText);
  return (
    <HtmlToReact className={css.wrapper} data-test-id={testId('notesSection')}>
      {notesTemplate({ salesTax: salesTax })}
    </HtmlToReact>
  );
};

Note.contextTypes = {
  testId: PropTypes.func,
  marketplace: PropTypes.object
};

export default Note;
