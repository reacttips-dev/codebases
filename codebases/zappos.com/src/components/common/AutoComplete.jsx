import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';

import { clearAutoComplete, unRegisterAutoComplete, updateAutoComplete } from 'actions/autoComplete';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/common/autoComplete.scss';

export const AutoComplete = ({ autoComplete, clearAutoComplete, id, title, values, handler, updateAutoComplete }) => {
  const { testId } = useMartyContext();
  const inputRef = useRef();

  useEffect(() => {
    clearAutoComplete(id);

    return () => {
      unRegisterAutoComplete(id);
    };
  }, [id, clearAutoComplete]);

  useEffect(() => {
    const autoCompleteValues = autoComplete[id]?.values;
    const currentValue = inputRef.current.value;
    if (!autoCompleteValues && currentValue) {
      inputRef.current.value = '';
    }
  }, [autoComplete, id]);

  const filterVal = e => {
    const searchText = e.target.value;
    const matchedValues = values.filter(v => handler(v, searchText));
    updateAutoComplete(id, searchText, matchedValues);
  };

  const submit = e => {
    e.preventDefault();
  };

  return (
    <form
      method="post"
      className={css.autoComplete}
      onSubmit={submit}
      role="search"
      aria-label={title}>
      <input
        type="text"
        id={title}
        data-test-id={testId(`autoComplete-${title}`)}
        ref={inputRef}
        placeholder={`Search ${title}`}
        onChange={filterVal}/>
      <label htmlFor={title} className="screenReadersOnly">Narrow Your {title} choices</label>
    </form>
  );
};

function mapStateToProps({ autoComplete }) {
  return {
    autoComplete
  };
}

export default connect(mapStateToProps, {
  clearAutoComplete,
  unRegisterAutoComplete,
  updateAutoComplete
})(AutoComplete);
