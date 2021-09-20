import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Flex,
  FormFieldset,
  Space,
  Tooltip
} from '@udacity/veritas-components';
import { __ } from '../../../services/localization-service';
import Select from '../select-menu';
import styles from './birthdate-form.module.scss';

export default class BirthdateForm extends Component {
  static propTypes = {
    onBirthdateFormChange: PropTypes.func.isRequired,
    shouldRenderDescription: PropTypes.bool.isRequired,
    error: PropTypes.string
  };

  state = {
    isTipOpen: false
  };

  _renderDescription() {
    return (
      <a href="#birthday-tip">{__('Why do I need to provide my birthday?')}</a>
    );
  }

  render() {
    const {
      error,
      onBirthdateFormChange,
      shouldRenderDescription
    } = this.props;

    const monthOptions = new Map([
      [1, __('Jan')],
      [2, __('Feb')],
      [3, __('Mar')],
      [4, __('Apr')],
      [5, __('May')],
      [6, __('Jun')],
      [7, __('Jul')],
      [8, __('Aug')],
      [9, __('Sep')],
      [10, __('Oct')],
      [11, __('Nov')],
      [12, __('Dec')]
    ]);
    let dayOptions = new Map();
    let maxYear = new Date().getFullYear();
    let yearOptions = new Map();

    for (let i = 1; i <= 31; i++) {
      dayOptions.set(i, i.toString());
    }
    for (let i = maxYear; i >= 1900; i--) {
      yearOptions.set(i, i.toString());
    }

    const dayPlaceholder = __('Day');
    const monthPlaceholder = __('Month');
    const yearPlaceholder = __('Year');

    return (
      <Flex direction="column" center>
        <div className={styles.description}>
          {__('Your Birthday')}
          {shouldRenderDescription && <Space type="inline" />}
          {shouldRenderDescription && (
            <Tooltip
              inverse
              direction="top"
              content={__(
                'Authorities in your region require us to collect your age to comply with local data privacy and collection regulations.'
              )}
              trigger={this._renderDescription()}
            />
          )}
        </div>
        <FormFieldset>
          <Flex center>
            <span className={styles.select}>
              <Select
                placeholder={dayPlaceholder}
                label={dayPlaceholder}
                options={dayOptions}
                ref={(day) => (this.day = day)}
                tooltipPlacement="start"
                error={error}
                onChange={onBirthdateFormChange}
              />
            </span>

            <span className={styles.select}>
              <Select
                placeholder={monthPlaceholder}
                label={monthPlaceholder}
                options={monthOptions}
                tooltipPlacement="top"
                ref={(month) => (this.month = month)}
                error={error}
                onChange={onBirthdateFormChange}
              />
            </span>

            <span className={styles.select}>
              <Select
                placeholder={yearPlaceholder}
                label={yearPlaceholder}
                options={yearOptions}
                tooltipPlacement="end"
                ref={(year) => (this.year = year)}
                error={error}
                onChange={onBirthdateFormChange}
              />
            </span>
          </Flex>
        </FormFieldset>
      </Flex>
    );
  }
}
