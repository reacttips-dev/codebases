import React from 'react';
import { locale } from '@trello/config';
import {
  N0,
  N500,
  Green500,
  Orange500,
  Purple500,
  Sky500,
  Lime500,
  Pink500,
  Red500,
  Yellow500,
  TrelloBlue500,
} from '@trello/colors';

import { Badge, IconBadge } from './Badge';
import SelectionModeIcon from '../icons/SelectionModeIcon';

const formatDate = (d: Date) =>
  d.toLocaleString(locale, {
    month: 'short',
    day: 'numeric',
  });

/**
 * CheckboxFieldBadge
 */
interface CheckboxFieldBadgeProps {
  className?: string;
  field: { name: string };
  item?: {
    value?: {
      checked: string;
    };
  };
}

export const CheckboxFieldBadge: React.FC<CheckboxFieldBadgeProps> = ({
  className,
  field,
  item,
}) => {
  if (!item || !item.value || item.value.checked !== 'true') {
    return null;
  }
  return (
    <IconBadge className={className} icon={<SelectionModeIcon />}>
      {field.name}
    </IconBadge>
  );
};

/**
 * DateField Badge Badge
 */
interface DateFieldBadgeProps {
  className?: string;
  field: { name: string };
  item?: {
    value?: {
      date: string;
    };
  };
}

export const DateFieldBadge: React.FC<DateFieldBadgeProps> = ({
  className,
  field,
  item,
}) => {
  if (!item || !item.value || !item.value.date) {
    return null;
  }
  const formatted = formatDate(new Date(item.value.date));

  return (
    <Badge className={className}>
      <span>{`${field.name}: ${formatted}`}</span>
    </Badge>
  );
};

type ListFieldOptionColors =
  | 'green'
  | 'yellow'
  | 'orange'
  | 'red'
  | 'blue'
  | 'purple'
  | 'sky'
  | 'lime'
  | 'pink'
  | 'black'
  | 'none';

interface ListFieldBadgeProps {
  className?: string;
  field?: {
    name: string;
    options: {
      id: string;
      color: ListFieldOptionColors;
      value?: {
        text: string;
      };
    }[];
  };
  item?: {
    idValue: string;
  };
}

export const ListFieldBadge: React.FC<ListFieldBadgeProps> = ({
  className,
  field,
  item,
}) => {
  if (!item || !item.idValue || !field || !field.options) {
    return null;
  }

  const option = field.options.find((opt) => opt.id === item.idValue);
  if (!option || !option.value || !option.value.text) {
    return null;
  }

  let bgColor = 'transparent';
  let fontColor = 'N400';
  const ListFieldColorMap: Map<string, string> = new Map([
    ['green', Green500],
    ['yellow', Yellow500],
    ['orange', Orange500],
    ['red', Red500],
    ['blue', TrelloBlue500],
    ['purple', Purple500],
    ['sky', Sky500],
    ['lime', Lime500],
    ['pink', Pink500],
    ['black', N500],
  ]);

  if (
    option.color &&
    option.color !== 'none' &&
    ListFieldColorMap.has(option.color)
  ) {
    bgColor = ListFieldColorMap.get(option.color)!;
    fontColor = N0;
  }

  return (
    <Badge className={className} bgColor={bgColor} fontColor={fontColor}>
      <span>{`${field.name}: ${option.value.text}`}</span>
    </Badge>
  );
};

/**
 * NumberField Badge
 */
interface NumberFieldBadgeProps {
  className?: string;
  field: {
    name: string;
  };
  item?: {
    value?: {
      number: string;
    };
  };
}

export const NumberFieldBadge: React.FC<NumberFieldBadgeProps> = ({
  className,
  field,
  item,
}) => {
  if (!item || !item.value || !item.value.number) {
    return null;
  }
  const formatNumber = (num: number) =>
    num.toLocaleString(window.navigator.language, {
      maximumFractionDigits: 10,
    });

  const formatted = formatNumber(parseFloat(item.value.number));

  return (
    <Badge className={className}>
      <span>{`${field.name}: ${formatted}`}</span>
    </Badge>
  );
};

/**
 * TextField Badge
 */
interface TextFieldBadgeProps {
  className?: string;
  field: {
    name: string;
  };
  item?: {
    value?: {
      text: string;
    };
  };
}

export const TextFieldBadge: React.FC<TextFieldBadgeProps> = ({
  className,
  field,
  item,
}) => {
  if (!item || !item.value || !item.value.text) {
    return null;
  }

  return (
    <Badge className={className}>
      <span>{`${field.name}: ${item.value.text}`}</span>
    </Badge>
  );
};
