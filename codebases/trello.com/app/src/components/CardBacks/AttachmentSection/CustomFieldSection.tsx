/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useMemo } from 'react';
import moment from 'moment';
import _ from 'underscore';
import classNames from 'classnames';
import { CustomFieldIcon } from '@trello/nachos/icons/custom-field';
import { forTemplate } from '@trello/i18n';
import { Checkbox } from '@trello/nachos/checkbox';
import { CheckCircleIcon } from '@trello/nachos/icons/check-circle';
import { CalendarIcon } from '@trello/nachos/icons/calendar';
import { DropdownOptionsIcon } from '@trello/nachos/icons/dropdown-options';
import { NumberIcon } from '@trello/nachos/icons/number';
import { TextIcon } from '@trello/nachos/icons/text';
import { CardBackSectionHeading } from 'app/src/components/CardBacks/CardBackSectionHeading';
import { Gutter } from 'app/src/components/CardBacks/Gutter';

import styles from './CustomFieldSection.less';

const format = forTemplate('card_detail');

type CustomFieldType = 'checkbox' | 'date' | 'list' | 'number' | 'text';

interface CustomFieldOption {
  id: string;
  color: string;
  value?: {
    text: string;
  };
}

interface CustomFieldModel {
  id: string;
  name: string;
  options?: null | CustomFieldOption[];
  pos: number;
  type: CustomFieldType;
}

interface CustomFieldItemModel {
  idCustomField: string;
  idValue: string | null;
  value: string | null;
}

interface CustomFieldSectionProps {
  colorblind: boolean;
  customFieldItems: CustomFieldItemModel[];
  customFields: CustomFieldModel[];
}

export const CustomFieldSection = ({
  colorblind,
  customFields,
  customFieldItems,
}: CustomFieldSectionProps) => {
  const visibleCustomFields = useMemo(() => {
    return _.chain(customFields)
      .map((customField) => {
        const customFieldItem = customFieldItems.find(
          (customFieldItem) => customFieldItem.idCustomField === customField.id,
        );

        const customFieldWithValue = {
          ...customField,
          item: customFieldItem,
        };

        return customFieldWithValue;
      })
      .filter(
        (customField) =>
          customField.type === 'checkbox' || customField.item !== undefined,
      )
      .sortBy((customField) => customField.pos)
      .value();
  }, [customFields, customFieldItems]);

  return (
    <div>
      <CardBackSectionHeading
        title={format('custom-fields')}
        icon={<CustomFieldIcon size="large" />}
      />
      <Gutter>
        <div className={styles.customFieldItems}>
          {visibleCustomFields.map(({ name, type, item, options }) => {
            return (
              <CustomFieldItem
                name={name}
                type={type}
                value={item?.value}
                options={options}
                idOption={item?.idValue}
                colorblind={colorblind}
              />
            );
          })}
        </div>
      </Gutter>
    </div>
  );
};

interface CustomFieldItemProps {
  name: string;
  type: CustomFieldType;
  value?: string | null;
  options?: CustomFieldOption[] | null;
  idOption?: string | null;
  colorblind: boolean;
}

const CustomFieldItem = ({
  name,
  type,
  value,
  options,
  idOption,
  colorblind,
}: CustomFieldItemProps) => {
  let parsedValue = value ? JSON.parse(value) : '';
  let isChecked = false;
  let icon: JSX.Element | null = null;
  let colorClassName: string | null = null;

  if (type === 'checkbox') {
    isChecked = parsedValue.checked === 'true';
    icon = <CheckCircleIcon size="small" />;
  } else if (type === 'date') {
    parsedValue = moment(parsedValue.date).calendar();
    icon = <CalendarIcon size="small" />;
  } else if (type === 'list' && options && idOption) {
    const option = options?.find((option) => option.id === idOption);
    parsedValue = option?.value?.text || '';
    icon = <DropdownOptionsIcon size="small" />;
    colorClassName =
      option?.color && option?.color !== 'none' ? styles[option.color] : null;
  } else if (type === 'number') {
    parsedValue = parsedValue.number || '';
    icon = <NumberIcon size="small" />;
  } else if (type === 'text') {
    parsedValue = parsedValue.text || '';
    icon = <TextIcon size="small" />;
  } else {
    parsedValue = '';
  }

  if (type !== 'checkbox' && parsedValue.length === 0) {
    return null;
  }

  return (
    <div className={styles.customFieldItem}>
      <h3 className={styles.customFieldItemTitle} title={name}>
        <div className={styles.customFieldItemIcon}>{icon}</div>
        {name}
      </h3>
      <div
        className={classNames(
          styles.customFieldItemValue,
          colorClassName,
          type === 'checkbox' && styles.customFieldItemCheckbox,
          colorblind && colorClassName && styles.colorblind,
          colorClassName && styles.hasColor,
        )}
        title={parsedValue}
      >
        {type === 'checkbox' && <Checkbox readOnly isChecked={isChecked} />}
        {type !== 'checkbox' && parsedValue}
      </div>
    </div>
  );
};
