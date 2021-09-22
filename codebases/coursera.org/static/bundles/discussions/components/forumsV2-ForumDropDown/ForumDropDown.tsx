/* @jsx jsx */
import { jsx, css } from '@emotion/react';
import React from 'react';
import PropTypes from 'prop-types';
import { DropDown, TextTruncate } from '@coursera/coursera-ui';
import { Forum } from 'bundles/discussions/lib/types';
import { objectToQueryString } from './objectToQueryString';
import { CharacterLimitTruncation } from 'bundles/discussions/components/forumsV2-ForumDropDown/CharacterLimitTruncation';
import { Button, Theme, useTheme, withTheme } from '@coursera/cds-core';
import { ChevronDownIcon } from '@coursera/cds-icons';

export function getDropDownState<paramKeyType>(
  query: Record<string, string>,
  paramKeys: paramKeyType[]
): Record<string, unknown> {
  const result: Record<string, string> = {};

  paramKeys.forEach((key) => {
    if (typeof key === 'string' && key in query) {
      const value = query[key];
      result[key] = value || '';
    }
  });

  return result;
}

export type ForumDropDownOption<value, param> = {
  value: value | undefined;
  param: param;
  label: string;
  forum?: Forum;
};

export interface ForumDropDownProps<value, param> {
  options: ForumDropDownOption<value, param>[];
  selectedLabel?: string;
  style?: React.CSSProperties;
  onChange?: (option: ForumDropDownOption<value, param>) => void;
  characterLimit?: number;
  className?: string;
  theme: Theme;
  e2eId?: string;
}

export class ForumDropDown<value, param> extends React.Component<ForumDropDownProps<value, param>> {
  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  handleChangeFilter = (item) => {
    if (this.props.onChange) {
      this.props.onChange(item);
    } else {
      const addedFilter = {};
      addedFilter[item.param] = item.value;
      const queryStringOut = objectToQueryString({
        ...this.context.router.location.query,
        ...{ page: '1' },
        ...addedFilter,
      });
      const newPathName = this.context.router.location.pathname + '?' + queryStringOut;
      this.context.router.push(newPathName);
    }
  };

  render() {
    const { options, characterLimit, selectedLabel, ...buttonProps } = this.props;
    const key = options && options[0]?.param;
    const selectedOptions = getDropDownState(this.context?.router?.location?.query, [key]);

    if (options === undefined) {
      return null;
    }

    let results: ForumDropDownOption<value, param>[];
    if (selectedLabel) {
      results = options.filter((option) => option?.label === selectedLabel);
    } else {
      results = options.filter((option) => option.value === selectedOptions[String(key)]);
    }

    let selectedOption = results.shift();

    if (!selectedOption) {
      selectedOption = options[0];
    }

    const label =
      selectedOption?.label && selectedOption?.label.length > 25
        ? selectedOption?.label.substr(0, 25) + '...'
        : selectedOption?.label;

    return (
      <DropDown.ButtonMenuV2
        rootClassName={this.props.className}
        renderButton={({ getDropDownButtonProps }) => (
          <Button
            variant="ghost"
            aria-label={selectedOption?.label}
            type="button"
            style={buttonProps.style}
            {...getDropDownButtonProps()}
            icon={<ChevronDownIcon size={'small'} />}
            iconPosition="after"
            css={{
              padding: 0,
              ...this.props.theme.typography.body1,
              color: this.props.theme.palette.black[700],
            }}
            data-e2e={this.props.e2eId}
          >
            {CharacterLimitTruncation({ text: label, limit: 25 })}
          </Button>
        )}
        dropDownPosition={{ vertical: 'bottom', horizontal: 'left' }}
        maxHeight={200}
      >
        {options.map((item) => (
          <DropDown.Item
            onClick={() => {
              this.handleChangeFilter(item);
            }}
            label={item.label}
            value={item.value}
            key={'' + item.label + item.value}
          />
        ))}
      </DropDown.ButtonMenuV2>
    );
  }
}

export function ForumDropDownWithTheme<value, param>(props: Omit<ForumDropDownProps<value, param>, 'theme'>) {
  const theme = useTheme();
  return <ForumDropDown<value, param> {...props} theme={theme} />;
}
