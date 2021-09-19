import { useEffect, useReducer, useState } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';

import useMartyContext from 'hooks/useMartyContext';
import timedFetch from 'middleware/timedFetch';
import { fetchErrorMiddleware } from 'middleware/fetchErrorMiddleware';
import { trackError } from 'helpers/ErrorUtils';
import { formInputsToObject } from 'helpers/HtmlHelpers';
import { AriaLiveTee } from 'components/common/AriaLive';
import { AD_PREFERENCE_COOKIE } from 'constants/cookies';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { fetchAdPreferences, setAdPreferences } from 'actions/account/ads';

import css from 'styles/components/landing/zapposForm.scss';

const labelAfterInputElements = ['radio', 'checkbox'];

export const FormElement = props => {
  const { testId } = useMartyContext();

  const {
    tagName,
    setPrefValue,
    optOutPreference,
    index,
    required,
    label,
    ...attrs
  } = props;

  // these have to be separate as they're needed for both `attrs` spread operator, and used for other spots in this method
  const { type, value, name } = attrs;

  const uniqueId = `${name}-${index}`;
  const coercedRequired = required?.toString() === 'true';

  const isLabelAfter = labelAfterInputElements.includes(type);
  const labelElement = <label htmlFor={uniqueId}>{label}</label>;

  switch (tagName) {
    case 'input':
      return (
        <p className={css.option} key={`${uniqueId}-${optOutPreference}`}>
          { !isLabelAfter && labelElement } {/* render order label/input for non-radios */}
          <input
            required={coercedRequired}
            data-test-id={testId(name)}
            id={uniqueId}
            onChange={setPrefValue.bind(this, value)}
            defaultChecked={value === optOutPreference?.toString()}
            {...attrs}
          />
          { isLabelAfter && labelElement } {/* render order input/label instead of label/input for radios */}
        </p>
      );
    case 'textarea':
      return (
        <p className={css.option} key={uniqueId}>
          { labelElement }
          <textarea
            required={coercedRequired}
            data-test-id={testId(name)}
            id={uniqueId}
            {...attrs}
          />
        </p>
      );
    case 'button':
      /* take type as a property https://github.com/yannickcr/eslint-plugin-react/issues/1846 */
      /* eslint-disable react/button-has-type */
      return (
        <button
          key={`${value}-${index}`}
          className={css.submit}
          data-test-id={testId(name)}
          {...attrs}
        >
          {label}
        </button>
      );
      /* eslint-enable */
  }
};

const initialState = {
  error: false,
  success: false
};

const ERROR = 'ERROR';
const SUCCESS = 'SUCCESS';
const RESET = 'RESET';
function reducer(state, action) {
  switch (action) {
    case ERROR:
      return { error: true, success: false };
    case SUCCESS:
      return { error: false, success: true };
    case RESET:
      return initialState;
    default:
      return state;
  }
}

export const ZapposForm = props => {
  const {
    className,
    formListeners,
    parentIsDisabled = false,
    fetchAdPreferences,
    setAdPreferences,
    slotDetails,
    optOutPreference
  } = props;

  const { type } = slotDetails;

  const [{ error, success }, dispatch] = useReducer(reducer, initialState);
  const [prefValue, setPrefValue] = useState(null);

  useEffect(() => {
    switch (type) {
      case 'AdvertisingPreferences':
        fetchAdPreferences();
    }
  }, [fetchAdPreferences, type]);

  useEffect(() => {
    setPrefValue(optOutPreference);
  }, [optOutPreference]);

  const {
    controls,
    heading,
    successMessage,
    failureMessage,
    action,
    method = 'post'
  } = slotDetails;

  const onSubmit = e => {
    e.preventDefault();
    dispatch(RESET);

    if (type === 'AdvertisingPreferences' && (typeof prefValue === 'string' || typeof prefValue === 'boolean')) {
      // Ads preferences specific form call
      setAdPreferences(prefValue)
        .then(res => (res?.ads?.success ? dispatch(SUCCESS) : dispatch(ERROR)))
        .catch(() => dispatch(ERROR));
    } else {
      // General all-purpose form POST
      const fetcher = timedFetch(`ZapposForm-${action}`);
      const body = JSON.stringify(formInputsToObject(e.target));
      fetcher(action, { method, body })
        .then(fetchErrorMiddleware)
        .then(() => dispatch(SUCCESS))
        .catch(err => {
          dispatch(ERROR);
          trackError('ERROR', `Zappos Form: ${action}`, err);
        });
    }
  };

  return (
    <div className={cn(css.container, className)}>
      { heading && <h2>{ heading }</h2> }

      {!error && success &&
        <AriaLiveTee>
          <p className={css.success}>{successMessage}</p>
        </AriaLiveTee>
      }

      {error &&
        <AriaLiveTee>
          <p className={css.failure}>{failureMessage}</p>
        </AriaLiveTee>
      }

      { /* our custom eslint rule doesnt accept method as a prop */
        /* eslint-disable-next-line marty/form-has-method */ }
      <form onSubmit={onSubmit} method={method} action={action} {...formListeners}>
        <fieldset disabled={parentIsDisabled}>
          {controls.map((option, index) =>
            <FormElement
              {...option}
              key={option.label + option.name}
              index={index}
              setPrefValue={setPrefValue}
              optOutPreference={optOutPreference}/>
          )}
        </fieldset>
      </form>
    </div>
  );
};

const mapStateToProps = state => {
  const { cookies } = state;

  const adPreferenceCookie = cookies[AD_PREFERENCE_COOKIE];
  const adPreferences = adPreferenceCookie ? JSON.parse(adPreferenceCookie) : null;
  const { optOutPreference } = adPreferences || {};

  return {
    optOutPreference
  };
};

const mapDispatchToProps = {
  fetchAdPreferences,
  setAdPreferences
};

const ConnectedZapposForm = connect(mapStateToProps, mapDispatchToProps)(ZapposForm);
export default withErrorBoundary('ZapposForm', ConnectedZapposForm);
